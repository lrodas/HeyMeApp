import { Pais } from './pais.model';
export class Region {
    constructor(
        public idRegion?: number,
        public nombre?: string,
        public pais?: Pais
    ) {}
}
