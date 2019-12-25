import { Provincia } from './provincia.model';
import { Pais } from './pais.model';
export class Contacto {
    constructor(
        public idContacto?: number,
        public nombre?: string,
        public apellido?: string,
        public telefono?: string,
        public email?: string,
        public pais?: Pais,
        public provincia?: Provincia,
        public direccion?: string,
        public estado?: boolean
    ) { }
}
