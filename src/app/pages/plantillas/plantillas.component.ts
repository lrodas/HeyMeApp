import { Component, OnInit } from '@angular/core';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { Plantilla } from '../../models/plantilla.model';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-plantillas',
  templateUrl: './plantillas.component.html',
  styleUrls: ['./plantillas.component.css']
})
export class PlantillasComponent implements OnInit {

  public plantillas: Plantilla[];
  public permisos: Permiso;
  public page: number;

  constructor(
    private plantillasService: PlantillasService
  ) { }

  ngOnInit() {
    this.cargarPlantillas();
    this.cargarPermisos();
    this.page = 1;
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permisos = permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Plantillas de notificaciones';
    })[0];
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
