import { Plantilla } from '../../models/plantilla.model';
export interface PlantillaRequest {
    usuario: string;
    idUsuario: number;
    pagina: string;
    plantilla: Plantilla;
}
