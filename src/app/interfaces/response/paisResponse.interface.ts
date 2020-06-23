import { Pais } from '../../models/pais.model';
export interface PaisResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    pais?: Pais;
    paises?: Pais[];
}
