import { Usuario } from '../../models/usuario.model';
export interface UsuarioRequest {
    usuario: string;
    idUsuario: number;
    pagina: string;
    datos: Usuario;
}
