import { Contacto } from '../../models/contacto.model';
export interface ContactoResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    contactos: Contacto[];
}
