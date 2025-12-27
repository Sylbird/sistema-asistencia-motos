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
import { EditParaderoDialog, Paradero } from './dialog/edit-paradero-dialog';

@Component({
  selector: 'app-paradero-admin',
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
  templateUrl: './paraderos-admin.html',
  styleUrl: './paraderos-admin.scss',
})
export class ParaderosAdmin {
  paraderos = signal<Paradero[]>([]);
  loading = signal(false);

  displayedColumns = ['nombre', 'direccion', 'lat', 'lng', 'radioMetros', 'acciones'];

  constructor(
    private apiService: Api,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadParaderos();
  }

  async loadParaderos() {
    this.loading.set(true);
    try {
      const response = await this.apiService.get<{
        success: boolean;
        message: string;
        status: number;
        data: Paradero[];
      }>('/paradero');
      if (response.success) {
        this.paraderos.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching paraderos', error);
      this.snackBar.open('Error al cargar paraderos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditParaderoDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: null, // null indicates add mode
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createParadero(result);
      }
    });
  }

  openEditDialog(paradero: Paradero) {
    const dialogRef = this.dialog.open(EditParaderoDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: paradero,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateParadero(result);
      }
    });
  }

  async createParadero(data: Omit<Paradero, 'idParadero' | 'creadoEn'>) {
    this.loading.set(true);
    try {
      const response = await this.apiService.post<{
        success: boolean;
        message: string;
      }>('/paradero/insertar-paradero', data);

      if (response.success) {
        this.snackBar.open('Paradero creado correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadParaderos();
      }
    } catch (error: any) {
      console.error('Error creating paradero', error);
      const errorMessage = error?.response?.data?.message || 'Error al crear paradero';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  async updateParadero(data: Partial<Paradero> & { idParadero: string }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.patch<{
        success: boolean;
        message: string;
      }>('/paradero/actualizar-paradero', data);

      if (response.success) {
        this.snackBar.open('Paradero actualizado correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadParaderos();
      }
    } catch (error: any) {
      console.error('Error updating paradero', error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar paradero';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  deleteParadero(paradero: Paradero) {
    // Placeholder for future delete functionality
    console.log('Delete paradero:', paradero);
    this.snackBar.open('Función de eliminación en desarrollo', 'OK', {
      duration: 2000,
    });
  }
}
