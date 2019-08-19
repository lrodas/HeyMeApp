import { Component, OnInit } from '@angular/core';
import { Plantilla } from '../../models/plantilla.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styles: []
})
export class PlantillaComponent implements OnInit {

  public plantilla: Plantilla;

  constructor(
    private activatedRoute: ActivatedRoute,
    private plantillasService: PlantillasService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];
      if (id !== 'nuevo') {
        this.obtenerPlantilla(id);
      }
    });
  }

  ngOnInit() {
    this.plantilla = new Plantilla(null, '', '', true);
  }

  public obtenerPlantilla(idPlantilla: number) {
    this.plantillasService.obtenerPlantilla(idPlantilla, 'plantilla')
      .subscribe( (response: PlantillaResponse) => {
          this.plantilla = response.plantilla;
      });
  }

  public guardarPlantilla(form: NgForm) {

    if (form.invalid) {
      return;
    }
    this.plantillasService.guardarPlantilla(this.plantilla, 'plantilla')
      .subscribe( (response: Plantilla) => {
        if (response) {
          this.router.navigate(['/template', response.idPlantillaNotificacion]);
        }
      });
  }

}
