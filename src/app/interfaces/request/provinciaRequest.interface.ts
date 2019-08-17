import { Provincia } from '../../models/provincia.model';
export interface ProvinciaRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    provincia?: Provincia;
}
