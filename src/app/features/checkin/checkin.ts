import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsistenciaService, Asistencia } from '../../core/services/asistencia.service';

interface HistorialGroup {
  idProgramacion: string;
  fecha: string;
  paraderoNombre: string;
  turnoNombre: string;
  llegada: Asistencia | null;
  salida: Asistencia | null;
}

@Component({
  selector: 'app-checkin',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
  ],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss',
})
export class Checkin implements OnInit {
  loading = signal(false);
  markingLlegada = signal(false);
  markingSalida = signal(false);

  rawAsistencias = signal<Asistencia[]>([]);

  historialGroups = computed(() => {
    const asistencias = this.rawAsistencias();
    const groups = new Map<string, HistorialGroup>();

    asistencias.forEach((a) => {
      // Use idProgramacion as the unique key for the assignment
      const key = a.idProgramacion;

      if (!groups.has(key)) {
        groups.set(key, {
          idProgramacion: a.idProgramacion,
          fecha: a.fecha,
          paraderoNombre: a.paradero?.nombre || 'Desconocido',
          turnoNombre: a.turno?.nombre || 'Desconocido',
          llegada: null,
          salida: null,
        });
      }

      const group = groups.get(key)!;
      if (a.tipoMarcado === 'llegada') {
        group.llegada = a;
      } else if (a.tipoMarcado === 'salida') {
        group.salida = a;
      }
    });

    // Convert map to array and sort by date descending
    return Array.from(groups.values()).sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
  });

  location = signal<{ lat: number; lng: number } | null>(null);

  constructor(
    private asistenciaService: AsistenciaService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadHistorial();
    this.getLocation(); // Pre-fetch location
  }

  async loadHistorial() {
    this.loading.set(true);
    try {
      const response = await this.asistenciaService.getHistorial();
      if (response.success) {
        this.rawAsistencias.set(response.data);
      }
    } catch (error) {
      console.error('Error loading history', error);
      this.showMessage('Error cargando historial', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  getLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.showMessage('Geolocalización no soportada', 'error');
        reject('Not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.location.set(loc);
          resolve(loc);
        },
        (error) => {
          console.error('Error getting location', error);
          this.showMessage('Error obteniendo ubicación: ' + error.message, 'error');
          reject(error);
        },
        { enableHighAccuracy: true },
      );
    });
  }

  async marcar(tipo: 'llegada' | 'salida') {
    if (tipo === 'llegada') this.markingLlegada.set(true);
    else this.markingSalida.set(true);

    try {
      // Refresh location before marking to ensure accuracy
      const loc = await this.getLocation();

      const response = await this.asistenciaService.marcar({
        tipo_marcado: tipo,
        latitud: loc.lat,
        longitud: loc.lng,
      });

      if (response.success) {
        this.showMessage(response.message || 'Marcado exitoso', 'success');
        this.loadHistorial();
      } else {
        this.showMessage(response.message || 'Error desconocido', 'error');
      }
    } catch (error: any) {
      console.error('Error marking attendance', error);
      const message = error.response?.data?.message || 'Error al marcar asistencia';
      this.showMessage(message, 'error');
    } finally {
      if (tipo === 'llegada') this.markingLlegada.set(false);
      else this.markingSalida.set(false);
    }
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  loadMap() {
    const loc = this.location();
    if (loc) {
      const mapFrame = document.getElementById('mapFrame') as HTMLIFrameElement;
      // Check if mapFrame is already loaded
      if (!mapFrame.src) {
        mapFrame.src = `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=15&output=embed`;
      } else {
        console.log('Map already loaded');
      }
    }
  }
}
