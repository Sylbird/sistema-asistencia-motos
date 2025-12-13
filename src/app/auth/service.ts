import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { Api } from '../core/services/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiService: Api,
    private router: Router,
  ) {}

  async login(correo: string, clave: string): Promise<void> {
    try {
      const loginResponse: AxiosResponse = await this.apiService.post('/usuario/login', {
        correo,
        clave,
      });

      if (loginResponse.status === 200) {
        // TODO: use a real token from the backend
        localStorage.setItem('UserData', JSON.stringify(loginResponse.data));
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      throw error;
    }
  }

  async signUp(
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    telefono: string,
    clave: string,
  ): Promise<void> {
    try {
      const signUpResponse: AxiosResponse = await this.apiService.post('/usuario/registro', {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        correo,
        telefono,
        clave,
      });

      if (signUpResponse.status === 200) {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('UserData');
  }

  logout(): void {
    localStorage.removeItem('UserData');
    this.router.navigate(['/login']);
  }
}
