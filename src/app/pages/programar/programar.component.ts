import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-programar',
  templateUrl: './programar.component.html',
  styles: []
})
export class ProgramarComponent implements OnInit {

  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  permiso: Permiso;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    this.cargarPermisos();

    if (!this.permiso.alta) {
      this.router.navigate(['/dashboard']);
    }
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permiso = permisos.filter( (object: Permiso) => {
      return object.opcion.descripcion === 'Programar notificacion';
    })[0];
  }

  public handleDateClick(datos: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today < datos.date || today.getTime() === datos.date.getTime() ) {
      this.router.navigate(['/scheduleForm', datos.dateStr]);
    } else if (today > datos.date) {
      Swal.fire({
        type: 'warning',
        title: 'Fecha no valida',
        text: `Debes elegir una fecha igual o mayor a la fecha actual`,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }
}

