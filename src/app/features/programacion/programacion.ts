import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
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
  imports: [MatCardModule, CommonModule, MatButtonModule, MatTabsModule],
  templateUrl: './programacion.html',
  styleUrl: './programacion.scss',
})
export class Programacion implements OnInit {
  dataToday = signal<ProgramacionData | null>(null);
  dataTomorrow = signal<ProgramacionData | null>(null);

  loadingToday = signal(false);
  loadingTomorrow = signal(false);

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadData('today');
  }

  onTabChange(index: number) {
    const dia = index === 0 ? 'today' : 'tomorrow';
    // Only load if we haven't loaded it yet or if you want to refresh every time
    // For smoother UX, let's load if null.
    if (dia === 'tomorrow' && !this.dataTomorrow()) {
      this.loadData('tomorrow');
    } else if (dia === 'today' && !this.dataToday()) {
      this.loadData('today');
    }
  }

  async loadData(dia: 'today' | 'tomorrow') {
    const loadingSignal = dia === 'today' ? this.loadingToday : this.loadingTomorrow;
    const dataSignal = dia === 'today' ? this.dataToday : this.dataTomorrow;

    loadingSignal.set(true);
    try {
      const targetDate = new Date();
      if (dia === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const fecha = `${year}-${month}-${day}`;

      const response = await this.api.get<ProgramacionResponse>(
        `/programacion-automatica/visual/${fecha}`,
      );
      if (response.success) {
        dataSignal.set(response.data);
      }
    } catch (error) {
      console.error(`Error fetching programacion visual for ${dia}`, error);
    } finally {
      loadingSignal.set(false);
    }
  }
}
