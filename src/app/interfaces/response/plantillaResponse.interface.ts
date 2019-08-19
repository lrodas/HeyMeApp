import { Plantilla } from '../../models/plantilla.model';
export interface PlantillaResponse {
    indicador: string;
    codigo: string;
    descripcion: string;
    plantillas: Plantilla[];
    plantilla: Plantilla;
}
