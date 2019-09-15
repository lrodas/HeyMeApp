import { Notificacion } from '../../models/notificacion.model';
export interface NotificacionResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    notificaciones: Notificacion[];
    notificacion: Notificacion;
}
