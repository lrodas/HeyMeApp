import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../models/notificacion.model';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { NotificacionResponse } from '../../interfaces/response/notificacionResponse.interface';

@Component({
  selector: 'app-borradores',
  templateUrl: './borradores.component.html',
  styles: []
})
export class BorradoresComponent implements OnInit {

  public filtro: string;
  public errorFechas: boolean;
  public notificaciones: Notificacion[];

  constructor(
    private notificacionesService: NotificacionesService
  ) {
    this.notificaciones = [];
  }

  ngOnInit() {
    this.filtro = 'fecha';
    this.errorFechas = false;
  }

  public changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  public obtenerBorradores() {
    this.notificacionesService.obtenerNotificacionesPorEstado(1, 'borradores')
      .subscribe( (response: NotificacionResponse) => {
        this.notificaciones = response.notificaciones;
      });
  }

}
