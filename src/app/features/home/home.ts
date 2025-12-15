import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Api } from '../../core/services/api';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

interface Moto {
  idMoto: string;
  numeroMoto: number;
  placa: string | null;
  estado: string;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  myMoto = signal<Moto | null>(null);
  availableMotos = signal<Moto[]>([]);
  selectedMotoControl = new FormControl<number | null>(null, [Validators.required]);
  isLoading = signal(false);

  constructor(
    private api: Api,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.fetchInitialData();
  }

  async fetchInitialData() {
    this.isLoading.set(true);
    try {
      await Promise.all([this.getMyMoto(), this.getAvailableMotos()]);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getMyMoto() {
    try {
      const response = await this.api.get<ApiResponse<Moto | null>>('/moto/mi-moto');
      if (response.success) {
        this.myMoto.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching my moto', error);
    }
  }

  async getAvailableMotos() {
    try {
      const response = await this.api.get<ApiResponse<Moto[]>>('/moto/motos-disponibles');
      if (response.success) {
        this.availableMotos.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching available motos', error);
    }
  }

  async assignMoto() {
    if (this.selectedMotoControl.invalid || !this.selectedMotoControl.value) return;

    try {
      await this.api.put('/moto/asignar-usuario-a-moto', {
        numeroMoto: this.selectedMotoControl.value,
      });

      this.snackBar.open('Moto asignada correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });

      // Refresh data
      await this.fetchInitialData();
      this.selectedMotoControl.reset();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al asignar la moto';
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }
}
