import { Usuario } from '../../models/usuario.model';
export interface UsuarioResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    usuario: Usuario;
    usuarios: Usuario[];
}
