import { Permiso } from '../../models/permiso.model';
export interface PermisoResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    permisos: Permiso[];
}
