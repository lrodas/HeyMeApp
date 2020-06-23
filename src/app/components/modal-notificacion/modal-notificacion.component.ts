import { Component, OnInit } from '@angular/core';
import { ModalNotificacionService } from './modal-notificacion.service';
import { CANAL_EMAIL } from '../../config/config';
import { Notificacion } from 'src/app/models/notificacion.model';
import { EstadoNotificacion } from 'src/app/models/estadoNotificacion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Canal } from 'src/app/models/canal.model';

@Component({
  selector: 'app-modal-notificacion',
  templateUrl: './modal-notificacion.component.html',
  styleUrls: ['./modal-notificacion.component.css']
})
export class ModalNotificacionComponent implements OnInit {

  public canalEmail: number;
  constructor(
    public modalNotificacionService: ModalNotificacionService
  ) { }

  ngOnInit() {
    this.canalEmail = CANAL_EMAIL;
    this.modalNotificacionService.notificacion = new Notificacion(0, '', null, null,
      new EstadoNotificacion(), new Usuario(), '', [], new Canal());
  }
}
