import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {

  public filtro: string;

  constructor() { }

  ngOnInit() {
    this.filtro = 'fecha';
  }

  changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

}
