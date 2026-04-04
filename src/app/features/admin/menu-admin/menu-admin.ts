import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EditUserDialog, Usuario } from './dialog/edit-user-dialog';
import { ConfirmDialog } from './dialog/confirm-dialog';
import { Api } from '../../../core/services/api';

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
    MatPaginatorModule,
  ],
  templateUrl: './menu-admin.html',
  styleUrl: './menu-admin.scss',
})
export class MenuAdmin {
  conductores = new MatTableDataSource<Usuario>([]);
  admins = new MatTableDataSource<Usuario>([]);
  loading = signal(false);

  displayedColumns = ['nombreCompleto', 'correo', 'rol', 'telefono', 'acciones'];

  @ViewChild(MatPaginator) set paginator(content: MatPaginator) {
    this.conductores.paginator = content;
    this.admins.paginator = content;
  }

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
        this.conductores.data = response.data;
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
        this.admins.data = response.data;
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

  async deleteUsuario(usuario: Usuario) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        usuario: `${this.getNombreCompleto(usuario)}`,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loading.set(true);
        try {
          const data = { idUsuario: usuario.idUsuario };
          const response = await this.apiService.delete<{
            success: boolean;
            message: string;
          }>('/usuario/eliminar', { data });

          if (response.success) {
            this.snackBar.open('Usuario eliminado correctamente', 'OK', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
            // Reload data to reflect changes
            await this.loadData();
          }
        } catch (error) {
          console.error('Error deleting usuario', error);
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
        } finally {
          this.loading.set(false);
        }
      }
    });
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;
  }

  getRoleName(id_rol: number): string {
    return id_rol === 1 ? 'Administrador' : 'Conductor';
  }
}
