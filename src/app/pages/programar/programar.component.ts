import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import { Router } from '@angular/router';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';
import { Subject } from 'rxjs';
import {
  startOfDay,
  subDays,
  isSameDay,
  isSameMonth,
} from 'date-fns';

import Swal from 'sweetalert2';
import {NotificacionesService} from '../../services/notificaciones/notificaciones.service';
import {NotificacionResponse} from '../../interfaces/response/notificacionResponse.interface';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  green: {
    primary: '#00cc00',
    secondary: '#66ff99',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-programar',
  templateUrl: './programar.component.html',
  styles: []
})
export class ProgramarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  permiso: Permiso;
  locale = 'es';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  activeDayIsOpen = false;
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {

      }
    }
  ];
  events: CalendarEvent[] = [];

  constructor(
    public router: Router,
    public notificacionService: NotificacionesService
  ) {
    this.changeMonth();
  }

  ngOnInit() {
    this.cargarPermisos();

    if (!this.permiso.alta) {
      this.router.navigate(['/dashboard']);
    }
  }

  public changeMonth(event?: any): void {
    
    let date = null;
    if (event) {
      date = new Date(event.originalTarget.getAttribute('ng-reflect-view-date'));
    } else {
      date = new Date();
    }
    const fechaInicio = date.getFullYear() + '-' + (date.getMonth() + 1) + '-1';
    const fechaFin =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    this.obtenerNotificacion(fechaInicio, fechaFin);
  }

  public obtenerNotificacion(fechaInicio: string, fechaFin: string): void {
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();
    this.events = [];

    this.notificacionService.obtenerNotificacionesPorFechaProgramacion(
      fechaInicio, fechaFin, 'notificaciones'
    ).subscribe( (response: NotificacionResponse) => {
      console.log(response);
      if (response.indicador === 'SUCCESS') {
        response.notificaciones.forEach(notificacion => {
          const fechaEnvio = new Date(notificacion.fechaEnvio);
          this.events.push({
            title: notificacion.titulo,
            start: fechaEnvio,
            color: (
              notificacion.estado === 'enviado' ?
                colors.green : (
                  notificacion.estado.descripcion === 'PROGRAMADA' && new Date(notificacion.fechaEnvio) > new Date() ?
                    colors.yellow:
                    colors.red))
          });
        });
        this.refresh.next();
        Swal.close();
      }
    });
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permiso = permisos.filter( (object: Permiso) => {
      return object.opcion.descripcion === 'Programar notificacion';
    })[0];
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }

    Swal.fire({
      title: '¿Quieres crear una notificación?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today < date || today.getTime() === date.getTime() ) {
          this.router.navigate(['/scheduleForm', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()]);
        } else if (today > date) {
          Swal.fire({
            type: 'warning',
            title: 'Fecha no valida',
            text: `Debes elegir una fecha igual o mayor a la fecha actual`,
            showConfirmButton: false,
            timer: 3000
          });
        }
      }
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }
}

