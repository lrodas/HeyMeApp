import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-borradores',
  templateUrl: './borradores.component.html',
  styles: []
})
export class BorradoresComponent implements OnInit {

  public filtro: string;
  public errorFechas: boolean;
  public notificaciones: Notificacion[];

  constructor() {
    this.notificaciones = [];
  }

  ngOnInit() {
    this.filtro = 'fecha';
    this.errorFechas = false;
  }

  public changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

}
