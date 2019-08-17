import { Contacto } from '../../models/contacto.model';
export interface ContactoRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    contacto?: Contacto;
    fechaFin?: Date;
    fechaInicio?: Date;
}
