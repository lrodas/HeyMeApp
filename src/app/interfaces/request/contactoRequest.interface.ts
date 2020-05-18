import { Contacto } from '../../models/contacto.model';
export interface ContactoRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    contacto?: Contacto;
    contactos?: Contacto[];
    fechaFin?: Date;
    fechaInicio?: Date;
}
