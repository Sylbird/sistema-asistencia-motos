import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  loading = signal(false);

  async onSubmit(e: Event) {
    e.preventDefault();
    if (this.emailControl.invalid) return;

    this.loading.set(true);
    try {
      await this.authService.requestPasswordRecovery(this.emailControl.value!);
      this.snackBar.open(
        'Si el correo existe, recibirás instrucciones para recuperar tu contraseña.',
        'Cerrar',
        {
          duration: 5000,
        },
      );
      this.router.navigate(['/login']);
    } catch (error) {
      this.snackBar.open('Error al solicitar recuperación. Inténtalo de nuevo.', 'Cerrar', {
        duration: 3000,
      });
    } finally {
      this.loading.set(false);
    }
  }
}
