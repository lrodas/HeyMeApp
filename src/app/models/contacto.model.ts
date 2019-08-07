import { Region } from './region.model';
export class Contacto {
    constructor(
        public idContacto?: number,
        public nombre?: string,
        public apellido?: string,
        public telefono?: string,
        public email?: string,
        public region?: Region,
        public direccion?: string,
        public estado?: boolean
    ) { }
}
