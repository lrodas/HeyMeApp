import { EstadoPaquete } from './estadoPaquete.model';
import { DetallePaquete } from './detallePaquete.model';

export class Paquete {
    constructor(
        public idPaquete?: number,
        public nombre?: string,
        public precioGTQ?: number,
        public precioUSD?: number,
        public estadoPaquete?: EstadoPaquete,
        public detalle?: DetallePaquete,
        public button?: string,
        public icono?: string,
        public descripcion?: string
    ) {}
}