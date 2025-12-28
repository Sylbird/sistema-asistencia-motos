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
import { MatChipsModule } from '@angular/material/chips';
import { Api } from '../../core/services/api';
import { EditMotoDialog, Moto } from './dialog/edit-moto-dialog';

@Component({
  selector: 'app-vehiculos-admin',
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
    MatChipsModule,
  ],
  templateUrl: './vehiculos-admin.html',
  styleUrl: './vehiculos-admin.scss',
})
export class VehiculosAdmin {
  motos = signal<Moto[]>([]);
  loading = signal(false);

  displayedColumns = ['numeroMoto', 'placa', 'estado', 'fechaModificacion', 'acciones'];

  constructor(
    private apiService: Api,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadMotos();
  }

  async loadMotos() {
    this.loading.set(true);
    try {
      const response = await this.apiService.get<{
        success: boolean;
        message: string;
        status: number;
        data: Moto[];
      }>('/moto');
      if (response.success) {
        this.motos.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching motos', error);
      this.snackBar.open('Error al cargar motos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditMotoDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: null, // null indicates add mode
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createMoto(result);
      }
    });
  }

  openEditDialog(moto: Moto) {
    const dialogRef = this.dialog.open(EditMotoDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: moto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateMoto(result);
      }
    });
  }

  async createMoto(data: { numeroMoto: number }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.post<{
        success: boolean;
        message: string;
      }>('/moto/insertar-moto', data);

      if (response.success) {
        this.snackBar.open('Moto creada correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadMotos();
      }
    } catch (error: any) {
      console.error('Error creating moto', error);
      const errorMessage = error?.response?.data?.message || 'Error al crear moto';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  async updateMoto(data: Partial<Moto> & { idMoto: string }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.patch<{
        success: boolean;
        message: string;
      }>('/moto/actualizar-moto', data);

      if (response.success) {
        this.snackBar.open('Moto actualizada correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadMotos();
      }
    } catch (error: any) {
      console.error('Error updating moto', error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar moto';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  deleteMoto(moto: Moto) {
    // Placeholder for future delete functionality
    console.log('Delete moto:', moto);
    this.snackBar.open('Función de eliminación en desarrollo', 'OK', {
      duration: 2000,
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
