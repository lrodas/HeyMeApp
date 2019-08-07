import { Usuario } from './usuario.model';
import { Contacto } from './contacto.model';
import { EstadoNotificacion } from './estadoNotificacion.model';
import { Canal } from './canal.model';

export class Notificacion {
    constructor(
        public idNotificacion?: number,
        public titulo?: string,
        public fechaEnvio?: Date,
        public fechaProgramacion?: Date,
        public estadoNotificacion?: EstadoNotificacion,
        public usuario?: Usuario,
        public notificacion?: string,
        public destinatario?: Contacto,
        public canal?: Canal
    ) {}
}