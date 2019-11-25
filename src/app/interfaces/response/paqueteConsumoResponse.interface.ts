import { NotificacionesRestantes } from '../../models/notificacionesRestantes.model';
export interface PaqueteConsumoResponse {
    indicador?: string;
    codigo?: string;
    descripcion?: string;
    paqueteActivo?: NotificacionesRestantes;
}