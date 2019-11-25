import { Component, OnInit } from '@angular/core';
import { ModalPlantillaService } from './modal-plantilla.service';
import { Plantilla } from '../../models/plantilla.model';

@Component({
  selector: 'app-modal-plantillas',
  templateUrl: './modal-plantillas.component.html',
  styleUrls: ['./modal-plantillas.component.css']
})
export class ModalPlantillasComponent implements OnInit {

  public page: number;

  constructor(
    public modalPlantillasService: ModalPlantillaService
  ) { }

  ngOnInit() {
    this.page = 1;
  }

  public seleccionarPlantilla(plantilla: Plantilla) {
    this.modalPlantillasService.plantilla = plantilla;
    this.modalPlantillasService.notificacion.emit(plantilla);
    this.modalPlantillasService.ocultarModal();
  }

}
