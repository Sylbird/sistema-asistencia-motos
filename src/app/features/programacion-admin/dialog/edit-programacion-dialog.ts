import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Api } from '../../../core/services/api';

export interface Programacion {
  idProgramacion: number;
  fecha: string;
  creadoEn?: string;
  moto: {
    idMoto: string;
    numeroMoto: number;
    placa: string | null;
    estado: string;
  };
  paradero: {
    idParadero: string;
    nombre: string;
    direccion: string;
  };
  turno: {
    idTurno: string;
    nombre: string;
    horaInicio: string;
    horaFin: string;
  };
}

interface Moto {
  idMoto: string;
  numeroMoto: number;
  placa: string | null;
  estado: string;
}

interface Paradero {
  idParadero: string;
  nombre: string;
  direccion: string;
}

interface Turno {
  idTurno: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-edit-programacion-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-programacion-dialog.html',
  styleUrls: ['./edit-programacion-dialog.scss'],
})
export class EditProgramacionDialog {
  programacionForm: FormGroup;
  isEditMode: boolean;
  loading = signal(false);

  motos = signal<Moto[]>([]);
  paraderos = signal<Paradero[]>([]);
  turnos = signal<Turno[]>([]);

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    public dialogRef: MatDialogRef<EditProgramacionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Programacion | null,
  ) {
    this.isEditMode = !!data?.idProgramacion;

    this.programacionForm = this.fb.group({
      idMoto: [data?.moto?.idMoto || '', [Validators.required]],
      idParadero: [data?.paradero?.idParadero || '', [Validators.required]],
      idTurno: [data?.turno?.idTurno || '', [Validators.required]],
      fecha: [data?.fecha ? new Date(data.fecha) : new Date(), [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  async loadFormData() {
    this.loading.set(true);
    try {
      // Load all dropdown data concurrently
      const [motosRes, paraderosRes, turnosRes] = await Promise.all([
        this.apiService.get<{ success: boolean; data: Moto[] }>('/moto'),
        this.apiService.get<{ success: boolean; data: Paradero[] }>('/paradero'),
        this.apiService.get<{ success: boolean; data: Turno[] }>('/turno'),
      ]);

      if (motosRes.success) {
        this.motos.set(motosRes.data);
      }
      if (paraderosRes.success) {
        this.paraderos.set(paraderosRes.data);
      }
      if (turnosRes.success) {
        this.turnos.set(turnosRes.data);
      }
    } catch (error) {
      console.error('Error loading form data', error);
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.programacionForm.valid) {
      const formData = this.programacionForm.getRawValue();

      // Format date to YYYY-MM-DD
      const fecha =
        formData.fecha instanceof Date
          ? formData.fecha.toISOString().split('T')[0]
          : formData.fecha;

      if (this.isEditMode && this.data?.idProgramacion) {
        // Edit mode: include idProgramacion
        const updatedData = {
          idProgramacion: this.data.idProgramacion.toString(),
          idMoto: formData.idMoto,
          idParadero: formData.idParadero,
          idTurno: formData.idTurno,
          fecha: fecha,
        };
        this.dialogRef.close(updatedData);
      } else {
        // Add mode
        const newData = {
          idMoto: formData.idMoto,
          idParadero: formData.idParadero,
          idTurno: formData.idTurno,
          fecha: fecha,
        };
        this.dialogRef.close(newData);
      }
    }
  }

  getTurnoDisplay(turno: Turno): string {
    return `${turno.nombre} (${turno.horaInicio.substring(0, 5)} - ${turno.horaFin.substring(0, 5)})`;
  }
}
