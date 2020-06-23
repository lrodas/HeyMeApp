import { DatosNotificacionPrecio } from 'src/app/models/DatosNotificacionPrecio.model';

export interface DatosNotificacionPrecioResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    datos: DatosNotificacionPrecio[];
}
