import { Region } from '../../models/region.model';
export interface RegionResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    regiones: Region[];
}
