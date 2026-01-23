import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service';
import { NgOptimizedImage } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage,
    MatSnackBarModule,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  readonly signUpForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidoPaterno: new FormControl('', [Validators.required]),
    apellidoMaterno: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  hidePassword = signal(true);
  errorMessage = signal('');

  togglePassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, clave } =
        this.signUpForm.value;
      try {
        await this.authService.signUp(
          nombre!,
          apellidoPaterno!,
          apellidoMaterno!,
          correo!,
          telefono!,
          clave!,
        );
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Error al registrar usuario';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }
    }
  }
}
