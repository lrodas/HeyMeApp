import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  calendarEvents: EventInput[] = [
    { title: 'Luis Rodas', start: new Date() }
  ];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  public handleDateClick(e: any) {
    this.router.navigate(['/scheduleForm', e.dateStr]);
  }

}
