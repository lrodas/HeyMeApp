import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import { Router } from '@angular/router';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';
import { Subject } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-programar',
  templateUrl: './programar.component.html',
  styles: []
})
export class ProgramarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  permiso: Permiso;
  locale: string = 'es';
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
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

  activeDayIsOpen: boolean = false;

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

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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

  setView(view: CalendarView) {
    this.view = view;
  }
}

