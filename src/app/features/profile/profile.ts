import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../core/services/api';

interface UserData {
  idUsuario: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
}

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user = signal<UserData | null>(null);
  isEditing = signal(false);
  loading = signal(false);

  profileForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidoPaterno: new FormControl('', [Validators.required]),
    apellidoMaterno: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
  });

  constructor(
    private api: Api,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('UserData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.user.set(parsedData);
      this.initForm(parsedData);
    }
  }

  initForm(data: UserData) {
    this.profileForm.patchValue({
      nombre: data.nombre,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,
      correo: data.correo,
      telefono: data.telefono,
    });
  }

  toggleEditMode() {
    this.isEditing.set(!this.isEditing());
    if (!this.isEditing() && this.user()) {
      this.initForm(this.user()!);
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid || !this.user()) return;

    this.loading.set(true);
    const formValue = this.profileForm.value;
    const currentUser = this.user()!;

    // Identify changed fields
    const updates: Partial<UserData> = {};
    let hasChanges = false;

    if (formValue.nombre !== currentUser.nombre) {
      updates.nombre = formValue.nombre!;
      hasChanges = true;
    }
    if (formValue.apellidoPaterno !== currentUser.apellidoPaterno) {
      updates.apellidoPaterno = formValue.apellidoPaterno!;
      hasChanges = true;
    }
    if (formValue.apellidoMaterno !== currentUser.apellidoMaterno) {
      updates.apellidoMaterno = formValue.apellidoMaterno!;
      hasChanges = true;
    }
    if (formValue.correo !== currentUser.correo) {
      updates.correo = formValue.correo!;
      hasChanges = true;
    }
    if (formValue.telefono !== currentUser.telefono) {
      updates.telefono = formValue.telefono!;
      hasChanges = true;
    }

    if (!hasChanges) {
      this.isEditing.set(false);
      this.loading.set(false);
      return;
    }

    try {
      const payload = {
        idUsuario: currentUser.idUsuario,
        ...updates,
      };

      await this.api.patch('/usuario/actualizar', payload);

      // Update local state
      const updatedUser = { ...currentUser, ...updates };
      this.user.set(updatedUser);
      localStorage.setItem('UserData', JSON.stringify(updatedUser));

      this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });

      this.isEditing.set(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.loading.set(false);
    }
  }
}
