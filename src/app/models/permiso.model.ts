import { Opcion } from './opcion.model';
import { Role } from './role.model';
export class Permiso {
    constructor(
        public idPermiso?: number,
        public opcion?: Opcion,
        public puesto?: Role,
        public alta?: boolean,
        public baja?: boolean,
        public cambio?: boolean,
        public imprimir?: boolean
    ) {}
}
