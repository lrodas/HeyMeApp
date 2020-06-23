import { Canal } from '../../models/canal.model';
export interface CanalRequest {
    usuario: string;
    idUsuario: number;
    pagina: string;
    canal: Canal;
}
