import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss',
})
export class NewPassword implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  idReseteoClave: string | null = null;
  isValidating = signal(true);
  isValidToken = signal(false);
  isSubmitting = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  missmatchErrorMessage = signal('');

  passwordForm = new FormGroup(
    {
      clave: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarClave: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(g: any) {
    return g.get('clave').value === g.get('confirmarClave').value ? null : { mismatch: true };
  }

  async ngOnInit() {
    this.idReseteoClave = this.route.snapshot.paramMap.get('idReseteoClave');

    if (!this.idReseteoClave) {
      this.handleInvalidToken();
      return;
    }
    console.log('Validando token:', this.idReseteoClave);
    try {
      await this.authService.validateRecoveryToken(this.idReseteoClave);
      this.isValidToken.set(true);
    } catch (error: any) {
      if (error.response?.status === 400) {
        this.handleInvalidToken();
      } else {
        throw error;
      }
    } finally {
      this.isValidating.set(false);
    }
  }

  handleInvalidToken() {
    this.isValidToken.set(false);
    this.snackBar.open('El enlace de recuperación es inválido o ha expirado.', 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  async onSubmit() {
    if (this.passwordForm.invalid || !this.idReseteoClave) return;

    this.isSubmitting.set(true);
    const { clave, confirmarClave } = this.passwordForm.value;

    try {
      await this.authService.changePassword(this.idReseteoClave, clave!, confirmarClave!);
      this.snackBar.open('Contraseña actualizada correctamente.', 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
      });
      this.router.navigate(['/login']);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al actualizar la contraseña.';
      this.snackBar.open(msg, 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  togglePassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  toggleConfirmPassword(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }
}
