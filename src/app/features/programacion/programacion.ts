import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Api } from '../../core/services/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}

interface Turno {
  nombre: string;
  horario: string;
  horaInicio: string;
  horaFin: string;
  tipoDia: string | null;
  numeros: number[];
  totalMotos: number;
}

interface Paradero {
  nombre: string;
  direccion: string;
  turnos: Turno[];
}

interface ProgramacionData {
  fecha: string;
  totalAsignaciones: number;
  paraderos: Paradero[];
}

type ProgramacionResponse = ApiResponse<ProgramacionData>;

@Component({
  selector: 'app-programacion',
  imports: [MatCardModule, CommonModule],
  templateUrl: './programacion.html',
  styleUrl: './programacion.scss',
})
export class Programacion implements OnInit {
  programacionVisual = signal<ProgramacionData | null>(null);
  isLoading = signal(false);

  constructor(private api: Api) {}

  ngOnInit() {
    this.getProgramacionVisual();
  }

  async getProgramacionVisual() {
    this.isLoading.set(true);
    try {
      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const fecha = `${year}-${month}-${day}`;

      const response = await this.api.get<ProgramacionResponse>(
        `/programacion-automatica/visual/${fecha}`,
      );
      if (response.success) {
        this.programacionVisual.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching programacion visual', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
