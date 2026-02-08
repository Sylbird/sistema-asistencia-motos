import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface Moto {
  idMoto: string;
  numeroMoto: number;
  placa: string;
  estado: string;
  estadoAuditoria?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

@Component({
  selector: 'app-edit-moto-dialog',
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
  templateUrl: './edit-moto-dialog.html',
  styleUrls: ['./edit-moto-dialog.scss'],
})
export class EditMotoDialog {
  motoForm: FormGroup;
  isEditMode: boolean;

  estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditMotoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Moto | null,
  ) {
    this.isEditMode = !!data?.idMoto;

    this.motoForm = this.fb.group({
      numeroMoto: [data?.numeroMoto || '', [Validators.required, Validators.min(1)]],
      placa: [
        { value: data?.placa || '', disabled: !this.isEditMode },
        this.isEditMode ? [Validators.required] : [],
      ],
      estado: [
        { value: data?.estado || 'activo', disabled: !this.isEditMode },
        this.isEditMode ? [Validators.required] : [],
      ],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.motoForm.valid) {
      const formData = this.motoForm.getRawValue();

      if (this.isEditMode && this.data?.idMoto) {
        // Edit mode: include idMoto and all fields
        const updatedData = {
          idMoto: this.data.idMoto,
          numeroMoto: formData.numeroMoto,
          placa: formData.placa,
          estado: formData.estado,
        };
        this.dialogRef.close(updatedData);
      } else {
        // Add mode: only send numeroMoto
        const newData = {
          numeroMoto: formData.numeroMoto,
        };
        this.dialogRef.close(newData);
      }
    }
  }
}
