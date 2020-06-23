import { Pais } from '../../models/pais.model';
export interface PaisRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    pais?: Pais;
}
