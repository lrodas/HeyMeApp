import { Component, OnInit } from '@angular/core';
import { Plantilla } from '../../models/plantilla.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { NgForm } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';
import { Canal } from 'src/app/models/canal.model';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styles: []
})
export class PlantillaComponent implements OnInit {

  public plantilla: Plantilla;
  public permisos: Permiso;
  public limiteCaracteres: number;

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
    this.plantilla = new Plantilla(null, '', '', true, new Canal());
    this.limiteCaracteres = 150;
  }

  public cambiarLimite(canal: string) {
    if (canal === '1') {
      if (this.plantilla.plantilla && this.plantilla.plantilla.length > 150) {
        this.plantilla.plantilla = this.plantilla.plantilla.substring(0, 150);
      }
      this.limiteCaracteres = 150;
    } else if (canal === '2') {
      this.limiteCaracteres = 2500;
    } else if (canal === '3') {
      if (this.plantilla.plantilla && this.plantilla.plantilla.length > 150) {
        this.plantilla.plantilla = this.plantilla.plantilla.substring(0, 150);
      }
      this.limiteCaracteres = 150;
    }
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
