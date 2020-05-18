import { Region } from './region.model';
export class Provincia {
    constructor(
        public idProvincia?: number,
        public nombre?: string,
        public region?: Region
    ) {}
}
