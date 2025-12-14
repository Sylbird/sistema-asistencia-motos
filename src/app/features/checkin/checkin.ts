import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkin',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss',
})
export class Checkin {
  loading = signal(false);
  location = signal<{
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: Date;
  } | null>(null);
  locationError = signal('');

  async getLocation() {
    this.loading.set(true);
    this.locationError.set('');
    this.location.set(null);

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

      // TODO: Get checkin location from backend and compare with current location
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
}
