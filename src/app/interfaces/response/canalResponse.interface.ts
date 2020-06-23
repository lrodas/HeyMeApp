import { Canal } from '../../models/canal.model';
export interface CanalResponse {
    codigo: string;
    descripcion: number;
    indicador: string;
    canal?: Canal;
    canals?: Canal[];
}
