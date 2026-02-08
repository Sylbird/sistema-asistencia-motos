import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface Usuario {
  idUsuario: string;
  correo: string;
  id_rol: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

@Component({
  selector: 'app-edit-user-dialog',
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
  templateUrl: './edit-user-dialog.html',
  styleUrls: ['./edit-user-dialog.scss'],
})
export class EditUserDialog {
  userForm: FormGroup;

  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Conductor' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
  ) {
    this.userForm = this.fb.group({
      correo: [data.correo, [Validators.required, Validators.email]],
      nombre: [data.nombre, [Validators.required]],
      apellidoPaterno: [data.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [data.apellidoMaterno, [Validators.required]],
      telefono: [data.telefono, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      id_rol: [data.id_rol, [Validators.required]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const updatedData = {
        idUsuario: this.data.idUsuario,
        ...this.userForm.value,
      };
      this.dialogRef.close(updatedData);
    }
  }

  getFullName(): string {
    return `${this.data.nombre} ${this.data.apellidoPaterno} ${this.data.apellidoMaterno}`;
  }
}
