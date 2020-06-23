import { Paquete } from '../../models/paquete.model';

export interface PaqueteResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    paquetes?: Paquete[];
}
