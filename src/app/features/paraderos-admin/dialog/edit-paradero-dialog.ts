import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface Paradero {
  idParadero: number;
  nombre: string;
  direccion: string;
  lat: string;
  lng: string;
  radioMetros: number;
  creadoEn?: string;
}

@Component({
  selector: 'app-edit-paradero-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './edit-paradero-dialog.html',
  styleUrls: ['./edit-paradero-dialog.scss'],
})
export class EditParaderoDialog {
  paraderoForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditParaderoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Paradero | null,
  ) {
    this.isEditMode = !!data?.idParadero;

    this.paraderoForm = this.fb.group({
      nombre: [data?.nombre || '', [Validators.required]],
      direccion: [data?.direccion || '', [Validators.required]],
      lat: [data?.lat || '', [Validators.required]],
      lng: [data?.lng || '', [Validators.required]],
      radioMetros: [data?.radioMetros || 100, [Validators.required, Validators.min(1)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.paraderoForm.valid) {
      const formData = this.paraderoForm.value;

      if (this.isEditMode && this.data?.idParadero) {
        // Edit mode: include idParadero
        const updatedData = {
          idParadero: this.data.idParadero.toString(),
          ...formData,
        };
        this.dialogRef.close(updatedData);
      } else {
        // Add mode: just return form data
        this.dialogRef.close(formData);
      }
    }
  }
}
