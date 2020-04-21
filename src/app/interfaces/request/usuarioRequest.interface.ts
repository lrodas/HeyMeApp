import { Usuario } from '../../models/usuario.model';
export interface UsuarioRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    datos?: Usuario;
    recaptchaResponse?: string
}
