import { Injectable, EventEmitter } from '@angular/core';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { Plantilla } from '../../models/plantilla.model';

@Injectable({
  providedIn: 'root'
})
export class ModalPlantillaService {

  public oculto: string;
  public plantillas: Plantilla[];
  public notificacion = new EventEmitter<any>();
  public plantilla: Plantilla;

  constructor(
    public plantillaService: PlantillasService
  ) {
    this.oculto = 'd-none';
    this.obtenerPlantillasActivas();
  }

  public mostrarModal() {
    this.oculto = '';
  }

  public ocultarModal() {
    this.oculto = 'd-none';
  }

  public obtenerPlantillasActivas() {
    this.plantillaService.obtenerPlantillasPorEstado(true, 'modal plantillas')
      .subscribe( (response: PlantillaResponse) => {
        this.plantillas = response.plantillas;
      });
  }
}
