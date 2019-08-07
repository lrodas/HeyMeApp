import { Role } from './role.model';
import { Genero } from './genero.model';
export class Usuario {
    constructor(
        public idUsuario?: number,
        public nombres?: string,
        public apellidos?: string,
        public direccion?: string,
        public telefono?: number,
        public role?: Role,
        public username?: string,
        public password?: string,
        public img?: string,
        public genero?: Genero,
        public estado?: boolean
    ) { }
}
