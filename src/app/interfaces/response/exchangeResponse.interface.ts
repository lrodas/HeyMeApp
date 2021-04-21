import { TipoCambio } from '../../models/tipoCambio.model';
export interface ExchangeResponse {
    codigo: string;
    descripcion: number;
    indicador: string;
    tipoCambio: TipoCambio;
    tipoCambios: TipoCambio[];
}
