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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Api } from '../../core/services/api';
import { EditProgramacionDialog, Programacion } from './dialog/edit-programacion-dialog';

interface Paradero {
  idParadero: string;
  nombre: string;
  direccion: string;
}

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './programacion-admin.html',
  styleUrl: './programacion-admin.scss',
})
export class ProgramacionAdmin {
  allProgramaciones = signal<Programacion[]>([]);
  filteredProgramaciones = signal<Programacion[]>([]);
  paraderos = signal<Paradero[]>([]);
  loading = signal(false);
  selectedDate = signal<Date>(new Date());
  selectedParadero = signal<string>('all'); // 'all' means show all paraderos

  displayedColumns = ['moto', 'paradero', 'turno', 'fecha', 'acciones'];

  constructor(
    private apiService: Api,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProgramaciones();
    this.loadParaderos();
  }

  async loadProgramaciones() {
    this.loading.set(true);
    try {
      const response = await this.apiService.get<{
        success: boolean;
        message: string;
        status: number;
        data: Programacion[];
      }>('/programacion');
      if (response.success) {
        this.allProgramaciones.set(response.data);
        this.filterProgramaciones();
      }
    } catch (error) {
      console.error('Error fetching programaciones', error);
      this.snackBar.open('Error al cargar programaciones', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  async loadParaderos() {
    try {
      const response = await this.apiService.get<{
        success: boolean;
        data: Paradero[];
      }>('/paradero');
      if (response.success) {
        this.paraderos.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching paraderos', error);
    }
  }

  filterProgramaciones() {
    const selected = this.selectedDate();
    const selectedDateStr = this.formatDateToYYYYMMDD(selected);
    const selectedParaderoId = this.selectedParadero();

    const filtered = this.allProgramaciones().filter((prog) => {
      const progDate = prog.fecha.split('T')[0]; // Get YYYY-MM-DD part
      const dateMatches = progDate === selectedDateStr;
      const paraderoMatches =
        selectedParaderoId === 'all' || prog.paradero.idParadero === selectedParaderoId;

      return dateMatches && paraderoMatches;
    });

    this.filteredProgramaciones.set(filtered);
  }

  onDateChange(date: Date | null) {
    if (date) {
      this.selectedDate.set(date);
      this.filterProgramaciones();
    }
  }

  onParaderoChange(paraderoId: string) {
    this.selectedParadero.set(paraderoId);
    this.filterProgramaciones();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditProgramacionDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: null, // null indicates add mode
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createProgramacion(result);
      }
    });
  }

  openEditDialog(programacion: Programacion) {
    const dialogRef = this.dialog.open(EditProgramacionDialog, {
      width: '500px',
      maxWidth: '95vw',
      data: programacion,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProgramacion(result);
      }
    });
  }

  async createProgramacion(data: {
    idMoto: string;
    idParadero: string;
    idTurno: string;
    fecha: string;
  }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.post<{
        success: boolean;
        message: string;
      }>('/programacion/insertar', data);

      if (response.success) {
        this.snackBar.open('Programación creada correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadProgramaciones();
      }
    } catch (error: any) {
      console.error('Error creating programacion', error);
      const errorMessage = error?.response?.data?.message || 'Error al crear programación';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  async updateProgramacion(data: {
    idProgramacion: string;
    idMoto?: string;
    idParadero?: string;
    idTurno?: string;
    fecha?: string;
  }) {
    this.loading.set(true);
    try {
      const response = await this.apiService.patch<{
        success: boolean;
        message: string;
      }>('/programacion/actualizar', data);

      if (response.success) {
        this.snackBar.open('Programación actualizada correctamente', 'OK', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        // Reload data to reflect changes
        await this.loadProgramaciones();
      }
    } catch (error: any) {
      console.error('Error updating programacion', error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar programación';
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  deleteProgramacion(programacion: Programacion) {
    // Placeholder for future delete functionality
    console.log('Delete programacion:', programacion);
    this.snackBar.open('Función de eliminación en desarrollo', 'OK', {
      duration: 2000,
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTurnoDisplay(turno: Programacion['turno']): string {
    return `${turno.nombre} (${turno.horaInicio.substring(0, 5)} - ${turno.horaFin.substring(0, 5)})`;
  }
}
