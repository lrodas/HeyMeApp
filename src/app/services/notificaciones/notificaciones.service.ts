import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(
    private http: HttpClient,
    private usuario: UsuarioService
  ) { }

  public guardarNotificacion() {

  }

  public obtenerNotificacionesPorEstado() {

    const url = URL_SERVICIOS + '/notification/findByStatus';

    const request: Notificaciones
  }
}
