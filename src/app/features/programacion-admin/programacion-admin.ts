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
import { EditTurnoDialog, Turno } from './edit-turno-dialog';

@Component({
  selector: 'app-programacion-admin',
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
  templateUrl: './programacion-admin.html',
  styleUrl: './programacion-admin.scss',
})
export class ProgramacionAdmin {
  turnos = signal<Turno[]>([]);
  loading = signal(false);

  displayedColumns = ['nombre', 'horaInicio', 'horaFin', 'activo', 'acciones'];

  constructor(
    private apiService: Api,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadTurnos();
  }

  async loadTurnos() {
    this.loading.set(true);
    try {
      const response = await this.apiService.get<{
        success: boolean;
        message: string;
        status: number;
        data: Turno[];
      }>('/turno');
      if (response.success) {
        this.turnos.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching turnos', error);
      this.snackBar.open('Error al cargar turnos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  openEditDialog(turno: Turno) {
    const dialogRef = this.dialog.open(EditTurnoDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: turno,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTurno(result);
      }
    });
  }

  async updateTurno(data: Partial<Turno> & { idTurno: string }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.patch<{
        success: boolean;
        message: string;
      }>('/turno/actualizar', data);

      if (response.success) {
        this.snackBar.open('Turno actualizado correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadTurnos();
      }
    } catch (error: any) {
      console.error('Error updating turno', error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar turno';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  deleteTurno(turno: Turno) {
    // Placeholder for future delete functionality
    console.log('Delete turno:', turno);
    this.snackBar.open('Función de eliminación en desarrollo', 'OK', {
      duration: 2000,
    });
  }

  getEstadoLabel(activo: number): string {
    return activo === 1 ? 'Activo' : 'Inactivo';
  }
}
