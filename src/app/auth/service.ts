import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { Api } from '../core/services/api';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
        // Set the token in local storage
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('UserData', JSON.stringify(loginResponse.data.usuario));

        // Navigate based on user role
        const userData = loginResponse.data.usuario;
        if (userData.id_rol === 1) {
          this.router.navigate(['/dashboard-admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
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

  async requestPasswordRecovery(correo: string): Promise<void> {
    try {
      await this.apiService.post('/reseteo-clave/solicitud-recuperacion', {
        correo,
      });
    } catch (error) {
      throw error;
    }
  }

  async validateRecoveryToken(token: string): Promise<void> {
    try {
      const response: AxiosResponse = await this.apiService.get(
        `/reseteo-clave/validacion/${token}`,
      );
      return response.data.success;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(token: string, clave: string, confirmarClave: string): Promise<void> {
    try {
      await this.apiService.patch(`/reseteo-clave/cambio-clave/${token}`, {
        clave,
        confirmarClave,
      });
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  getUserData(): any {
    const userData = localStorage.getItem('UserData');
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('UserData');
    this.router.navigate(['/login']);
  }
}
