import { Provincia } from './provincia.model';
export class Contacto {
    constructor(
        public idContacto?: number,
        public nombre?: string,
        public apellido?: string,
        public telefono?: string,
        public email?: string,
        public provincia?: Provincia,
        public direccion?: string,
        public estado?: boolean
    ) { }
}
