import { Empresa } from './empresa.model';

export class Grupo {
    constructor(
        public idGrupo: number,
        public nombre?: string,
        public empresa?: Empresa
    ) {}
}