import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: environment.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await this.axios.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }
}
