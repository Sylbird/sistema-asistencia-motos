import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface Turno {
  idTurno: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: number;
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

  activoOptions = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTurnoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Turno,
  ) {
    this.turnoForm = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      horaInicio: [data.horaInicio, [Validators.required]],
      horaFin: [data.horaFin, [Validators.required]],
      activo: [data.activo, [Validators.required]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.turnoForm.valid) {
      const updatedData = {
        idTurno: this.data.idTurno.toString(),
        ...this.turnoForm.value,
      };
      this.dialogRef.close(updatedData);
    }
  }
}
