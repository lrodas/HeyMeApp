import { Provincia } from '../../models/provincia.model';
export interface ProvinciaResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    provincias: Provincia[];
}
