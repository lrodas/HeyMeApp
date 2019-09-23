import { Role } from '../../models/role.model';
export interface RoleResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    roles: Role[];
    role: Role;
}
