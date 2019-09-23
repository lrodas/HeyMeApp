import { Permiso } from './permiso.model';
export class Role {
    constructor(
        public idRole?: number,
        public nombre?: string,
        public descripcion?: string,
        public estado?: boolean,
        public permisos?: Permiso[]
    ) {}
}
