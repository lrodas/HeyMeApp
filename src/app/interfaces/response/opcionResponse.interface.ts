import { Opcion } from '../../models/opcion.model';
export interface OpcionResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    opcion: Opcion;
    opciones: Opcion[];
}
