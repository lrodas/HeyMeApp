import { Empresa } from 'src/app/models/empresa.model';

export interface EmpresaRequest {
    usuario?: string;
    idUsuario?: number;
    pagina?: string;
    empresa?: Empresa,
    empresas?: Empresa[]
}