import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Api } from '../../../core/services/api';
import { Paradero } from '../../../core/services/asistencia.service';

export interface Turno {
  idTurno: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  paradero?: Paradero;
}

@Component({
  selector: 'app-edit-turno-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './edit-turno-dialog.html',
  styleUrls: ['./edit-turno-dialog.scss'],
})
export class EditTurnoDialog {
  turnoForm: FormGroup;
  paraderos = signal<Paradero[]>([]);

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    public dialogRef: MatDialogRef<EditTurnoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Turno | null,
  ) {
    this.turnoForm = this.fb.group({
      nombre: [data?.nombre || '', [Validators.required]],
      idParadero: [data?.paradero?.idParadero || '', [Validators.required]],
      horaInicio: [data?.horaInicio || '', [Validators.required]],
      horaFin: [data?.horaFin || '', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  async loadFormData() {
    // this.loading.set(true);
    try {
      // Load all dropdown data concurrently
      const paraderosRes = await Promise.resolve(
        this.apiService.get<{ success: boolean; data: Paradero[] }>('/paradero'),
      );
      if (paraderosRes.success) {
        this.paraderos.set(paraderosRes.data);
      }
    } catch (error) {
      console.error('Error loading form data', error);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.turnoForm.valid) {
      const formValue = this.turnoForm.value;
      const result: any = {
        idParadero: formValue.idParadero,
        nombre: formValue.nombre,
        horaInicio: formValue.horaInicio,
        horaFin: formValue.horaFin,
      };

      if (this.data?.idTurno) {
        result.idTurno = this.data.idTurno;
      }

      this.dialogRef.close(result);
    }
  }
}
