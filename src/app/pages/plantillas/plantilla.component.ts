import { Component, OnInit } from '@angular/core';
import { Plantilla } from '../../models/plantilla.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantillasService } from '../../services/plantillas/plantillas.service';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';
import { NgForm } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS, CANAL_SMS, CANAL_EMAIL, CANAL_WHATSAPP, OPCION_PLANTILLAS } from '../../config/config';
import { Canal } from 'src/app/models/canal.model';

import { CanalService } from '../../services/canal/canal.service';

declare var $: any;

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
    private router: Router,
    private canalService: CanalService
  ) {
    this.activatedRoute.params.subscribe( params => {
      const id = params.id;
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

    this.canalService.obtenerCanalesActivos('Programar notificacion')
      .subscribe((canales: Canal[]) => {
        canales.forEach((canal: Canal, i: number) => {
          if (canal.mostrarPlantilla) {
            if (i === 0) {
              $('#canal').append('<option selected value="' + canal.idCanal + '">' + canal.nombre + '</option>')
              // this.cambioCanal(canal.idCanal);
            } else { 
              $('#canal').append('<option value="' + canal.idCanal + '">' + canal.nombre + '</option>')
            }
          }
        });
        $('#canal').selectpicker('refresh');
      });
  }

  public cambioCanal(canal: Number) {
    if (Number(canal) === CANAL_SMS) {
      if (this.plantilla.plantilla && this.plantilla.plantilla.length > 150) {
        this.plantilla.plantilla = this.plantilla.plantilla.substring(0, 150);
      }
      this.limiteCaracteres = 150;
      document.getElementById('editor1').style.display = 'none';
      document.getElementById('editor2').style.display = 'block';
    } else if (Number(canal) === CANAL_EMAIL) {
      this.limiteCaracteres = 2500;
      document.getElementById('editor1').style.display = 'block';
      document.getElementById('editor2').style.display = 'none';
    } else if (Number(canal) === CANAL_WHATSAPP) {
      if (this.plantilla.plantilla && this.plantilla.plantilla.length > 150) {
        this.plantilla.plantilla = this.plantilla.plantilla.substring(0, 150);
      }
      this.limiteCaracteres = 150;
      document.getElementById('editor1').style.display = 'none';
      document.getElementById('editor2').style.display = 'block';
    }
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    return permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === OPCION_PLANTILLAS;
    })[0];
  }

  public obtenerPlantilla(idPlantilla: number) {
    this.plantillasService.obtenerPlantilla(idPlantilla, 'plantilla')
      .subscribe( (response: PlantillaResponse) => {
        this.plantilla = response.plantilla;
        $('select').selectpicker('val', response.plantilla.canal.idCanal);
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
