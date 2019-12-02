import { Canal } from './canal.model';
export class Plantilla {
    constructor(
        public idPlantillaNotificacion?: number,
        public titulo?: string,
        public plantilla?: string,
        public estado?: boolean,
        public canal?: Canal
    ) { }
}
