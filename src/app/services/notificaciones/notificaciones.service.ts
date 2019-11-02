import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { NotificacionRequest } from '../../interfaces/request/notificacionRequest.interface';
import { Notificacion } from '../../models/notificacion.model';
import { EstadoNotificacion } from '../../models/estadoNotificacion.model';
import { map, catchError } from 'rxjs/operators';
import { NotificacionResponse } from '../../interfaces/response/notificacionResponse.interface';

import Swal from 'sweetalert2';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private usuario: string;
  private titulo: string;
  private fechaInicio: Date;
  private fechaFin: Date;
  private estado: number;
  private pagina: string;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  public obtenerPrecioNotificacionesPorMes(pagina: string) {

    const url = URL_SERVICIOS + '/notification/retrieveNotificationPricePerMonth';

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion: new Notificacion()
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerConteoNotificacionesPorMes(pagina: string) {

    const url = URL_SERVICIOS + '/notification/retrieveNotificationCountPerMonth';

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion: new Notificacion()
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public guardarNotificacion(notificacion: Notificacion, pagina: string) {

    const url = URL_SERVICIOS + '/notification/save';

    notificacion.usuario = this.usuarioService.usuario;

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: NotificacionResponse) => {

        if (response.indicador === 'SUCCESS') {
            Swal.fire({
              type: 'success',
              title: 'Notificacion guardada exitosamente',
              text: `La notificacion ${notificacion.titulo} fue guardada con exito`,
              showConfirmButton: false,
              timer: 3000
            });
            return response.notificacion;
        } else {
          Swal.fire({
            type: 'error',
            title: 'No pudimos guardar la notificacion',
            text: `En estos momentos no fue posible guardar la notificacion: ${ notificacion.titulo }, por favor intenta mas tarde`,
            showConfirmButton: false,
            timer: 3000
          });
          return false;
        }

      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'No pudimos guardar la notificacion',
          text: `En estos momentos no fue posible guardar la notificacion: ${ notificacion.titulo }, por favor intenta mas tarde`,
          showConfirmButton: false,
          timer: 3000
        });
        return of(error);
      })
    );
  }

  public obtenerNotificacionesPorEstado(estado: number, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByStatus';

    this.estado = estado;
    this.pagina = pagina;
    this.usuario = '';
    this.titulo = '';
    this.fechaInicio = null;
    this.fechaFin = null;

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion: new Notificacion(null, '', null, null, new EstadoNotificacion(estado, ''))
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerNotificacionesPorFechaProgramacion(fechaInicio: String, fechaFin: String, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByProgrammingDate';

    this.estado = null;
    this.pagina = pagina;
    this.usuario = '';
    this.titulo = '';
    this.fechaInicio = new Date(Number(fechaInicio.split('-')[0]), Number(fechaInicio.split('-')[1]) - 1, Number(fechaInicio.split('-')[2]));
    this.fechaFin = new Date(Number(fechaFin.split('-')[0]), Number(fechaFin.split('-')[1]) - 1, Number(fechaFin.split('-')[2]));
    console.log('fechaInicio: ', this.fechaInicio, 'fechaFin: ', this.fechaFin);
    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerNotificacionesPorFechaEnvio(fechaInicio: String, fechaFin: String, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByShippingDate';

    this.estado = null;
    this.pagina = pagina;
    this.usuario = '';
    this.titulo = '';
    this.fechaInicio = new Date(Number(fechaInicio.split('-')[0]), Number(fechaInicio.split('-')[1]) - 1, Number(fechaInicio.split('-')[2]));
    this.fechaFin = new Date(Number(fechaFin.split('-')[0]), Number(fechaFin.split('-')[1]) - 1, Number(fechaFin.split('-')[2]));

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerNotificacionesPorUsuario(termino: string, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByUser';

    this.estado = null;
    this.pagina = pagina;
    this.usuario = termino;
    this.titulo = '';
    this.fechaInicio = null;
    this.fechaFin = null;

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      nombreUsuario: termino,
      pagina,
      notificacion: new Notificacion(null, '', null, null, new EstadoNotificacion(2, ''))
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerNotificacionPorTitulo(termino: string, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByTitle';

    this.estado = null;
    this.pagina = pagina;
    this.usuario = '';
    this.titulo = termino;
    this.fechaInicio = null;
    this.fechaFin = null;

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      pagina,
      notificacion: new Notificacion(null, termino, null, null, new EstadoNotificacion(2, ''))
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public descargarReporte(tipo: string): Observable<Blob> {

    let url: string;

    if (tipo === 'xlsx') {
      url = URL_SERVICIOS + '/report/notificationReportExcel';
    } else if (tipo === 'pdf') {
      url = URL_SERVICIOS + '/report/notificationReportPdf';
    }

    const pagina = this.pagina;
    let request: NotificacionRequest;

    if (this.estado) {
      const estado = this.estado;
      request = {
        usuario: this.usuarioService.usuario.username,
        pagina,
        notificacion: new Notificacion(null, '', null, null, new EstadoNotificacion(estado, ''))
      };

    } else if (this.usuario) {
      const usuario = this.usuario;
      request = {
        usuario: this.usuarioService.usuario.username,
        nombreUsuario: usuario,
        pagina,
        notificacion: new Notificacion(null, '', null, null, new EstadoNotificacion(2, ''))
      };

    } else if (this.titulo) {
      const titulo = this.titulo;
      request = {
        usuario: this.usuarioService.usuario.username,
        pagina,
        notificacion: new Notificacion(null, titulo, null, null, new EstadoNotificacion(2, ''))
      };
    } else if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = this.fechaInicio;
      const fechaFin = this.fechaFin;

      request = {
        usuario: this.usuarioService.usuario.username,
        idUsuario: this.usuarioService.usuario.idUsuario,
        pagina,
        fechaInicio,
        fechaFin,
        notificacion: new Notificacion(null, '', null, null, new EstadoNotificacion(2, ''))
      };
    }

    console.log(request);
    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token),
        responseType: 'blob'
    });
  }
}
