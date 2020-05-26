import { Empresa } from 'src/app/models/empresa.model';

export interface EmpresaResponse {
    codigo: string,
    descripcion: number,
    indicador: string,
    empresa?: Empresa,
    empresas?: Empresa[];
}