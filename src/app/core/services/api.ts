import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private axios: AxiosInstance;

  constructor(private router: Router) {
    this.axios = axios.create({
      baseURL: environment.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('UserData');
          this.router.navigate(['/login']);
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await this.axios.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await this.axios.patch(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
