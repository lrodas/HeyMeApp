import { Canal } from './canal.model';
import { Paquete } from './paquete.model';

export class DetallePaquete {
    constructor(
        public idDetallePaquete?: number,
        public canal?: Canal,
        public paquete?: Paquete,
        public cuota?: number
    ) {}
}