import { Component, OnInit } from '@angular/core';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { Plantilla } from '../../models/plantilla.model';

@Component({
  selector: 'app-plantillas',
  templateUrl: './plantillas.component.html',
  styleUrls: ['./plantillas.component.css']
})
export class PlantillasComponent implements OnInit {

  public plantillas: Plantilla[];

  constructor(
    private plantillasService: PlantillasService
  ) { }

  ngOnInit() {
    this.cargarPlantillas();
  }

  private cargarPlantillas() {
    this.plantillasService.obtenerPlantillas()
      .subscribe( (response: PlantillaResponse) => {
        this.plantillas = response.plantillas;
      });
  }

  public cambiarEstado(plantilla: Plantilla, estado: boolean) {

    plantilla.estado = estado;
    this.plantillasService.guardarPlantilla(plantilla, 'Plantillas')
      .subscribe();
  }

  public buscarPlantillaPorTermino(termino: string) {
    if (!termino) {
      this.cargarPlantillas();
      return;
    }

    this.plantillasService.obtenerPlantillaPorTitulo(termino, 'Plantillas')
      .subscribe( (response: PlantillaResponse) => {
        this.plantillas = response.plantillas;
      });
  }

}
