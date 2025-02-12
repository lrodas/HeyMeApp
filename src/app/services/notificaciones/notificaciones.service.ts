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

  public obtenerNotificacionPorId(pagina: string, idNotificacion: number) {

    const url = URL_SERVICIOS + '/notification/retrieveNotificationPerId';

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion: new Notificacion(idNotificacion)
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (notificacionResponse: NotificacionResponse) => {
        Swal.close();

        if (notificacionResponse.indicador !== 'SUCCESS') {
          Swal.fire({
            type: 'error',
            title: 'En estos momentos no es posible obtener los datos de la notificacion',
            text: notificacionResponse.descripcion
          });
          return false;
        } else {
          return notificacionResponse.notificacion;
        }
      }),
      catchError( error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no es posible obtener los datos de la notificacion',
          text: 'Por favor intenta nuevamente mas tarde'
        });

        return of([error]);
      })
    );
  }

  public cancelarNotificacion(pagina: string, idNotificacion: number) {

    const url = URL_SERVICIOS + '/notification/cancelNotificationDelivery';

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion: new Notificacion(idNotificacion)
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (notificacionResponse: NotificacionResponse) => {
        Swal.close();

        if (notificacionResponse.indicador === 'SUCCESS') {
          Swal.fire({
            type: 'success',
            title: 'Notificacion cancelada exitosamente',
            text: notificacionResponse.descripcion
          });
          return true;
        } else {
          Swal.fire({
            type: 'error',
            title: 'En estos momentos no es posible cancelar la notificacion',
            text: notificacionResponse.descripcion
          });
          return false;
        }
      }),
      catchError( error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no es posible cancelar la notificacion',
          text: 'Por favor intenta nuevamente mas tarde'
        });

        return of([error]);
      })
    );
  }

  public enviarNotificacion(pagina: string, idNotificacion: number) {

    const url = URL_SERVICIOS + '/notification/sendNotification';

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      notificacion: new Notificacion(idNotificacion)
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (notificacionResponse: NotificacionResponse) => {
        Swal.close();

        if (notificacionResponse.indicador === 'SUCCESS') {
          Swal.fire({
            type: 'success',
            title: 'Notificacion enviada',
            text: notificacionResponse.descripcion
          });
          return true;
        } else {
          Swal.fire({
            type: 'error',
            title: 'En estos momentos no es posible enviar la notificacion',
            text: notificacionResponse.descripcion
          });
          return false;
        }
      }),
      catchError( error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no es posible enviar la notificacion',
          text: 'Por favor intenta nuevamente mas tarde'
        });

        return of([error]);
      })
    );
  }

  public obtenerNotificacionesRestantes(pagina: string, fechaFin: Date) {

    const url = URL_SERVICIOS + '/notification/retrieveRemainingNotifications';

    const request: NotificacionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      fechaFin,
      tipo: 1
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

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
    }).pipe(
      map( (response: NotificacionResponse) => {

        response.notificaciones.sort((a: Notificacion, b: Notificacion) => {
          if (a.idNotificaciones < b.idNotificaciones) {
            return 1;
          } else if (a.idNotificaciones > b.idNotificaciones) {
            return -1;
          } else {
            return 0;
          }
        });
        return response;
      })
    );
  }

  public obtenerNotificacionesPorFechaProgramacion(fechaInicio: string, fechaFin: string, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByProgrammingDate';

    this.estado = null;
    this.pagina = pagina;
    this.usuario = '';
    this.titulo = '';
    this.fechaInicio =
      new Date(Number(fechaInicio.split('-')[0]), Number(fechaInicio.split('-')[1]) - 1, Number(fechaInicio.split('-')[2]));
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
    }).pipe(
      map( (response: NotificacionResponse) => {

        response.notificaciones.sort((a: Notificacion, b: Notificacion) => {
          if (a.idNotificaciones < b.idNotificaciones) {
            return 1;
          } else if (a.idNotificaciones > b.idNotificaciones) {
            return -1;
          } else {
            return 0;
          }
        });
        return response;
      })
    );
  }

  public obtenerNotificacionesPorFechaEnvio(fechaInicio: string, fechaFin: string, pagina: string) {

    const url = URL_SERVICIOS + '/notification/findByShippingDate';

    this.estado = null;
    this.pagina = pagina;
    this.usuario = '';
    this.titulo = '';
    this.fechaInicio =
      new Date(Number(fechaInicio.split('-')[0]), Number(fechaInicio.split('-')[1]) - 1, Number(fechaInicio.split('-')[2]));
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
    }).pipe(
      map( (response: NotificacionResponse) => {

        response.notificaciones.sort((a: Notificacion, b: Notificacion) => {
          if (a.idNotificaciones < b.idNotificaciones) {
            return 1;
          } else if (a.idNotificaciones > b.idNotificaciones) {
            return -1;
          } else {
            return 0;
          }
        });
        return response;
      })
    );
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
    }).pipe(
      map( (response: NotificacionResponse) => {

        response.notificaciones.sort((a: Notificacion, b: Notificacion) => {
          if (a.idNotificaciones < b.idNotificaciones) {
            return 1;
          } else if (a.idNotificaciones > b.idNotificaciones) {
            return -1;
          } else {
            return 0;
          }
        });
        return response;
      })
    );
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
    }).pipe(
      map( (response: NotificacionResponse) => {

        response.notificaciones.sort((a: Notificacion, b: Notificacion) => {
          if (a.idNotificaciones < b.idNotificaciones) {
            return 1;
          } else if (a.idNotificaciones > b.idNotificaciones) {
            return -1;
          } else {
            return 0;
          }
        });
        return response;
      })
    );
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

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token),
        responseType: 'blob'
    });
  }
}
