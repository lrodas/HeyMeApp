import { Grupo } from 'src/app/models/grupo.model';

export interface GrupoRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    grupo?: Grupo;
}