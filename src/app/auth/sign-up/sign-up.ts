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
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  constructor(private authService: AuthService) {}

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

  onSubmit() {
    if (this.signUpForm.valid) {
      const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, clave } =
        this.signUpForm.value;
      this.authService.signUp(
        nombre!,
        apellidoPaterno!,
        apellidoMaterno!,
        correo!,
        telefono!,
        clave!,
      );
    }
  }
}
