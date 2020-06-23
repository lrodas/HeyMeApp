import { Grupo } from 'src/app/models/grupo.model';

export interface GrupoResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    grupo?: Grupo;
    grupos?: Grupo[];
}
