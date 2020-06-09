import { Paquete } from '../../models/paquete.model';

export interface PaqueteRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    paquete?: Paquete;
    jsonResponse?: string
}