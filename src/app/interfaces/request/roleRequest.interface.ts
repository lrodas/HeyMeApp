import { Role } from '../../models/role.model';
export interface RoleRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    role?: Role;
}
