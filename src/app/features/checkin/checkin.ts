import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { Api } from '../../core/services/api';

@Component({
  selector: 'app-checkin',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTableModule,
    FormsModule,
  ],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss',
})
export class Checkin {
  loading = signal(false);

  // Data State
  paraderos = signal<Paradero[]>([]);
  selectedParaderoId = signal<number | null>(null);
  moto = signal<Moto | null>(null);
  asistencias = signal<Asistencia[]>([]);

  // Computed: selected paradero
  selectedParadero = signal<Paradero | undefined>(undefined);

  // Location State
  location = signal<{
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: Date;
  } | null>(null);
  locationError = signal('');

  constructor(
    private api: Api,
    private snackBar: MatSnackBar,
  ) {
    this.initData();
  }

  async initData() {
    this.loading.set(true);
    try {
      await Promise.all([this.loadParaderos(), this.loadMoto()]);
      // Load asistencias after moto is loaded
      if (this.moto()) {
        await this.loadAsistencias();
      }
    } catch (error) {
      console.error('Error loading initial data', error);
      this.snackBar.open('Error cargando datos iniciales', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  async loadParaderos() {
    try {
      const response = await this.api.get<{ success: boolean; data: Paradero[] }>('/paradero');
      if (response.success) {
        this.paraderos.set(response.data);
        this.updateSelectedParadero();
      }
    } catch (error) {
      console.error('Error fetching paraderos', error);
    }
  }

  async loadMoto() {
    try {
      const response = await this.api.get<{ success: boolean; data: Moto }>('/moto/mi-moto');
      if (response.success) {
        this.moto.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching moto', error);
    }
  }

  updateSelectedParadero() {
    const id = this.selectedParaderoId();
    if (id !== null) {
      const found = this.paraderos().find((p: Paradero) => p.id === id);
      this.selectedParadero.set(found);
    } else {
      this.selectedParadero.set(undefined);
    }
  }

  async getLocation() {
    this.loading.set(true);
    this.locationError.set('');
    // Do not reset location immediately to allow UI to show "Updating..." if needed,
    // or keep previous location while fetching new one. But per req, maybe reset is fine.
    // this.location.set(null);

    if (!navigator.geolocation) {
      this.locationError.set('Tu navegador no soporta geolocalización.');
      this.loading.set(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (err) => reject(err), {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      this.location.set({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        timestamp: new Date(position.timestamp),
      });
    } catch (err: any) {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          this.locationError.set('Permiso de ubicación denegado. Actívalo en configuración.');
          break;
        case err.POSITION_UNAVAILABLE:
          this.locationError.set('No se pudo obtener la ubicación.');
          break;
        case err.TIMEOUT:
          this.locationError.set('Tiempo agotado. Intenta de nuevo.');
          break;
        default:
          this.locationError.set('Error desconocido: ' + err.message);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async marcarAsistencia() {
    const loc = this.location();
    const moto = this.moto();
    const paraderoId = this.selectedParaderoId();
    const paradero = this.paraderos().find((p) => p.id === paraderoId);

    if (!loc) {
      this.snackBar.open('Primero debes obtener tu ubicación', 'Cerrar', { duration: 3000 });
      return;
    }
    if (!moto) {
      this.snackBar.open('No se encontró información de tu moto', 'Cerrar', { duration: 3000 });
      return;
    }
    if (!paradero) {
      this.snackBar.open('Debes seleccionar un paradero', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    try {
      const payload = {
        numeroMoto: moto.numeroMoto,
        direccionParadero: paradero.direccion, // Sending direccionParadero as per req, though ID might be better usually? following req.
        lat: loc.lat,
        lng: loc.lng,
      };

      await this.api.post('/asistencia/marcar-asistencia', payload);
      this.snackBar.open('Asistencia marcada correctamente', 'OK', {
        duration: 3000,
        panelClass: 'success-snackbar',
      });
      // Reload asistencias after successful marking
      await this.loadAsistencias();
    } catch (error) {
      console.error('Error marking attendance', error);
      this.snackBar.open('Error al marcar asistencia', 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    } finally {
      this.loading.set(false);
    }
  }

  async loadAsistencias() {
    const moto = this.moto();
    if (!moto) return;

    try {
      const response = await this.api.post<{ success: boolean; data: Asistencia[] }>(
        '/asistencia/obtener-por-moto',
        { numeroMoto: moto.numeroMoto },
      );
      if (response.success) {
        this.asistencias.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching asistencias', error);
    }
  }
}

interface Paradero {
  id: number;
  nombre: string;
  direccion: string;
  lat: string;
  lng: string;
  radioMetros: number;
  creadoEn: string;
}

interface Moto {
  idMoto: string;
  numeroMoto: number;
  placa: string | null;
  estado: string;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

interface Asistencia {
  id: number;
  numeroMoto: number;
  direccionParadero: string;
  lat: string;
  lng: string;
  creadoEn: string;
}
