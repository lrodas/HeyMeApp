import { Component, OnInit } from '@angular/core';
import { Plantilla } from '../../models/plantilla.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { NgForm } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styles: []
})
export class PlantillaComponent implements OnInit {

  public plantilla: Plantilla;
  public permisos: Permiso;

  constructor(
    private activatedRoute: ActivatedRoute,
    private plantillasService: PlantillasService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];
      if (id !== 'new' && this.cargarPermisos().cambio) {
        this.obtenerPlantilla(id);
      } else if (id === 'new' && !this.cargarPermisos().alta) {
        this.router.navigate(['/templates']);
      }
    });
  }

  ngOnInit() {
    this.plantilla = new Plantilla(null, '', '', true);
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    return permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Plantillas de notificaciones';
    })[0];
  }

  public obtenerPlantilla(idPlantilla: number) {
    this.plantillasService.obtenerPlantilla(idPlantilla, 'plantilla')
      .subscribe( (response: PlantillaResponse) => {
        this.plantilla = response.plantilla;
      }, error => {
        this.router.navigate(['/templates']);
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
