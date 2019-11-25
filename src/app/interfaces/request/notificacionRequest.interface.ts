import { Notificacion } from '../../models/notificacion.model';
export interface NotificacionRequest {
    usuario?: string;
    idUsuario?: number;
    nombreUsuario?: string;
    pagina?: string;
    notificacion?: Notificacion;
    fechaInicio?: Date;
    fechaFin?: Date;
    tipo?: number;
}
