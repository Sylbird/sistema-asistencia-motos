import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Api } from '../../core/services/api';
import { EditUserDialog, Usuario } from './edit-user-dialog';

@Component({
  selector: 'app-menu-admin',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './menu-admin.html',
  styleUrl: './menu-admin.scss',
})
export class MenuAdmin {
  conductores = signal<Usuario[]>([]);
  admins = signal<Usuario[]>([]);
  loading = signal(false);

  displayedColumns = ['nombreCompleto', 'correo', 'rol', 'telefono', 'acciones'];

  constructor(
    private apiService: Api,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      await Promise.all([this.loadConductores(), this.loadAdmins()]);
    } catch (error) {
      console.error('Error loading data', error);
      this.snackBar.open('Error al cargar datos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  async loadConductores() {
    try {
      const response = await this.apiService.get<{
        success: boolean;
        message: string;
        status: number;
        data: Usuario[];
      }>('/usuario/conductores');
      if (response.success) {
        this.conductores.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching conductores', error);
      throw error;
    }
  }

  async loadAdmins() {
    try {
      const response = await this.apiService.get<{
        success: boolean;
        message: string;
        status: number;
        data: Usuario[];
      }>('/usuario/admins');
      if (response.success) {
        this.admins.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching admins', error);
      throw error;
    }
  }

  openEditDialog(usuario: Usuario) {
    const dialogRef = this.dialog.open(EditUserDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUsuario(result);
      }
    });
  }

  async updateUsuario(data: Partial<Usuario> & { idUsuario: string }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.patch<{
        success: boolean;
        message: string;
      }>('/usuario/modificar', data);

      if (response.success) {
        this.snackBar.open('Usuario actualizado correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadData();
      }
    } catch (error: any) {
      console.error('Error updating usuario', error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar usuario';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  deleteUsuario(usuario: Usuario) {
    // Placeholder for future delete functionality
    console.log('Delete usuario:', usuario);
    this.snackBar.open('Función de eliminación en desarrollo', 'OK', {
      duration: 2000,
    });
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
  }

  getRoleName(id_rol: number): string {
    return id_rol === 1 ? 'Administrador' : 'Conductor';
  }
}
