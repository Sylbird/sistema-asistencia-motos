import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosResponse } from 'axios';
import { Api } from '../../core/services/api';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private apiService: Api) {}

  hidePassword = signal(true);

  readonly loginForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required]),
  });

  togglePassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  async onSubmit() {
    const loginResponse: AxiosResponse = await this.apiService.post(
      '/usuario/login',
      this.loginForm.getRawValue(),
    );

    if (loginResponse.status === 200) {
      console.log(loginResponse);
      console.log('REDIRECT TO DASHBOARD');
    }
  }
}
