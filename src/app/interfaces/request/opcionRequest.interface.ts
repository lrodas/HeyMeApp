import { Opcion } from '../../models/opcion.model';
export interface OpcionRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    opcion?: Opcion;
}
