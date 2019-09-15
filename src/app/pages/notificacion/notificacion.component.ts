import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../models/notificacion.model';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { NotificacionResponse } from '../../interfaces/response/notificacionResponse.interface';
import { NotificacionRequest } from '../../interfaces/request/notificacionRequest.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {

  public filtro: string;
  public notificaciones: Notificacion[];
  public fechaInicio: Date;
  public fechaFin: Date;

  constructor(
    public notificacionService: NotificacionesService
  ) { }

  ngOnInit() {
    this.filtro = 'fecha';
    this.fechaInicio = new Date();
    this.obtenerNotificacionesSemana();
  }

  public obtenerNotificacionesSemana() {

    const fechaFin = new Date();
    const fechaInicio = new Date() ;
    fechaInicio.setDate(fechaFin.getDate() - 7);

    this.notificacionService.obtenerNotificacionesPorFecha(fechaInicio, fechaFin, 'notificaciones')
      .subscribe( (response: NotificacionResponse) => {
        this.notificaciones = response.notificaciones;
      });
  }

  changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  public filtrarNotificaciones(termino: string) {

    if (!termino) {
      this.obtenerNotificacionesSemana();
      return;
    }

    this.notificacionService.obtenerNotificacionesPorUsuario(termino, 'Notificaciones')
      .subscribe( (response: NotificacionResponse) => {
        this.notificaciones = response.notificaciones;
      });
  }

  public obtenerNotificacionesPorFecha(form: NgForm) {

    this.notificacionService.obtenerNotificacionesPorFecha(this.fechaInicio, this.fechaFin, 'notificaciones')
      .subscribe( (response: NotificacionResponse) => {
        this.notificaciones = response.notificaciones;
      });
  }

  public filtrarNotificacionesPorTitulo(termino: string) {

    if (!termino) {
      this.obtenerNotificacionesSemana();
      return;
    }

    this.notificacionService.obtenerNotificacionPorTitulo(termino, 'Notificaciones')
      .subscribe( (response: NotificacionResponse) => {
        this.notificaciones = response.notificaciones;
      });
  }

  public exportarNotificaciones(tipo: string) {
    this.notificacionService.descargarReporte(tipo)
      .subscribe( x => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([x], { type: 'application/pdf' });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        link.download = `Reporte_Notificaciones_${ new Date().getDate() }_` +
          `${ new Date().getMonth() }_${ new Date().getFullYear() }_${ new Date().getHours() }_` +
          `${ new Date().getMinutes() }_${ new Date().getSeconds() }.` + tipo.toLowerCase();
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout( () => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
        }, 100);
    });
  }

}
