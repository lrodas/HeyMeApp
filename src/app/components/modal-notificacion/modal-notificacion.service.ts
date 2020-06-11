import { Injectable } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { Notificacion } from '../../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class ModalNotificacionService {
  
  public oculto: string;
  public notificacion: Notificacion
  public fechaProgramacion: String;
  public fechaEnvio: String;
  
  constructor(
    public notificacionService: NotificacionesService
  ) {
    this.oculto = 'd-none';
  }

  public mostrarModal(idNotificacion: number) {
    this.notificacionService.obtenerNotificacionPorId('modalNotificacion', idNotificacion)
      .subscribe( (notificacion: Notificacion) => {
        if (notificacion) {
          this.notificacion = notificacion;
          const fechaEnvioDate = new Date(notificacion.fechaEnvio);
          const fechaProgramacionDate = new Date(notificacion.fechaProgramacion);
          this.fechaEnvio = fechaEnvioDate.getDate() + '/' + fechaEnvioDate.getMonth() + '/' + fechaEnvioDate.getFullYear();
          this.fechaProgramacion = fechaProgramacionDate.getDate() + '/' + fechaProgramacionDate.getMonth() + '/' + fechaProgramacionDate.getFullYear();

          this.oculto = '';
        } else {
          this.oculto = 'd-none';
        }
      },
      error => this.oculto = 'd-none');
  }

  public ocultarModal() {
    this.oculto = 'd-none';
  }
}
