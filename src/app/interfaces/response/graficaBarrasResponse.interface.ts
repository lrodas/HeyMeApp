import { DataGrafica } from 'src/app/models/dataGrafica.model';
import { GrupoDataGrafica } from 'src/app/models/grupoDataGrafica.model';

export interface GraficaBarrasResponse  {
    indicador: string;
    codigo: string;
    descripcion: string;
    datos: DataGrafica[];
    series: GrupoDataGrafica[];
}
