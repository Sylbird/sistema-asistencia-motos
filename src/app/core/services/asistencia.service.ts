import { Injectable } from '@angular/core';
import { Api } from './api';

export interface Paradero {
  idParadero: string;
  nombre: string;
  direccion: string;
  lat: string;
  lng: string;
  radioMetros: number;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface Turno {
  idTurno: string;
  idParadero: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  cantidadMotos: number;
  diasSemana: string;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface Moto {
  idMoto: string;
  numeroMoto: number;
  placa: string | null;
  estado: string;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface Asistencia {
  idAsistencia: string;
  idProgramacion: string;
  idUsuario: string;
  idMoto: string;
  idParadero: string;
  idTurno: string;
  fecha: string;
  tipoMarcado: 'llegada' | 'salida';
  horaMarcado: string;
  horaEsperada: string;
  latitudMarcado: string;
  longitudMarcado: string;
  distanciaMetros: string;
  dentroRadio: boolean;
  estadoAsistencia: string;
  minutosDiferencia: number;
  ordenLlegada: number | null;
  observaciones: string | null;
  ipMarcado: string | null;
  dispositivo: string | null;
  estadoAuditoria: number;
  fechaCreacion: string;
  fechaModificacion: string;
  paradero: Paradero;
  turno: Turno;
  moto: Moto;
}

export interface HistorialResponse {
  success: boolean;
  message: string;
  status: number;
  data: Asistencia[];
}

export interface MarcarAsistenciaRequest {
  tipo_marcado: 'llegada' | 'salida';
  latitud: number;
  longitud: number;
}

export interface MarcarAsistenciaResponse {
  success: boolean;
  message: string;
  status: number;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  constructor(private api: Api) {}

  async getHistorial(): Promise<HistorialResponse> {
    return this.api.get<HistorialResponse>('/asistencia/mi-historial');
  }

  async marcar(data: MarcarAsistenciaRequest): Promise<MarcarAsistenciaResponse> {
    return this.api.post<MarcarAsistenciaResponse>('/asistencia/marcar', data);
  }
}
