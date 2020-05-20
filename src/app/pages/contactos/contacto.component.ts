import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RegionResponse } from '../../interfaces/response/RegionResponse.interface';
import { ProvinciaResponse } from '../../interfaces/response/provinciaResponse.interface';

import { ProvinciaService } from '../../services/provincia/provincia.service';
import { ContactoService } from '../../services/contacto/contacto.service';
import { RegionService } from '../../services/region/region.service';

import { Contacto } from '../../models/contacto.model';
import { Provincia } from '../../models/provincia.model';
import { Region } from '../../models/region.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { PaisService } from '../../services/pais/pais.service';
import { PaisResponse } from '../../interfaces/response/paisResponse.interface';
import { Pais } from '../../models/pais.model';
import { ID_PAIS_GT, OPCION_CONTACTOS } from '../../config/config';
import { Grupo } from '../../models/grupo.model';
import { GrupoService } from '../../services/grupo/grupo.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {

  public regiones: Region[];
  public provincias: Provincia[];
  public grupos: Grupo[];
  public contacto: Contacto;
  public isLocal: boolean;

  constructor(
    private regionService: RegionService,
    private provinciaService: ProvinciaService,
    private contactoService: ContactoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paisService: PaisService,
    private grupoService: GrupoService
  ) { }

  ngOnInit() {
    this.contacto = new Contacto(null, null, null, null, null, new Pais(null, null, null, null), new Provincia(null, null, new Region(null, null, null)), null, null, null, null, new Grupo(null));
    this.obtenerRegiones();
    this.obtenerProvincias();

    Promise.all([
      this.obtenerPaises(),
      this.obtenerRegiones(),
      this.obtenerProvincias()
    ]).then( respuesta => {
      this.activatedRoute.params.subscribe( params => {
        const id = params['id'];
        if (id !== 'new') {
          this.obtenerContacto(id);
        }
      });
    });
    this.obtenerProvinciaPorRegion();
    this.obtenerRegionPorPais();
    this.provincias = [];
    $('#ubicacion').hide();
    this.isLocal = false;

    $('#grupo').focus(() => {
      $('#myDropdown').addClass('show');
    });

    $('#grupo').keyup(() => {
      this.obtenerGrupos($('#grupo').val());
    });
  }

  public obtenerGrupos(nombre: string) {

    this.grupoService.obtenerGruposPorNombre(OPCION_CONTACTOS, nombre)
    .subscribe((grupos: Grupo[]) => {
      this.grupos = grupos;
    });
  }

  public seleccionarGrupo(grupo: Grupo) {
    this.contacto.grupo = grupo;
    $('#grupo').val(grupo.nombre);
    $('#myDropdown').removeClass('show');
  }

  public obtenerRegionPorPais() {
    const self = this;

    $('#idPais').on('change', function () {
      const idPais = Number($('#idPais').val());

      if (idPais === ID_PAIS_GT) {
        $('#ubicacion').show();
        $("#idRegion").attr('required',true);
        $("#idProvincia").attr('required',true);
      } else {
        $('#ubicacion').hide();
        $("#idRegion").removeAttr('required',true);
        $("#idProvincia").removeAttr('required',true);
      }
    });
  }

  public obtenerProvinciaPorRegion() {
    const self = this;

    $('#idRegion').on('change', function(){
      $("#idProvincia").children('option').remove();
      $("#idProvincia").selectpicker('destroy');
      
      const region = $('#idRegion').val();
      if (!Number(region)) {
        return;
      }
  
      self.provinciaService.obtenerProvinciaPorRegion(region, 'contacto')
        .subscribe((response: ProvinciaResponse) => {
          response.provincias.forEach( (provincia: Provincia) => {
            $('#idProvincia').append('<option value="' + provincia.idProvincia + '">' + provincia.nombre + '</option>')
          });
          $('#idProvincia').selectpicker('refresh');
        });
    });
  }

  public obtenerPaises(): Promise<boolean> {

    return new Promise( (resolve, reject) => {
      this.paisService.obtenerPaises('contacto')
      .subscribe( (response: PaisResponse) => {
        if (response.indicador === 'SUCCESS') {
          response.paises.forEach( (pais: Pais) => {
            $('#idPais').append('<option value="' + pais.idPais + '">' + pais.nombre + '</option>');
          });
          $('#idPais').selectpicker('refresh');
        }
        resolve(true);
      }, error => {
        reject(false);
      });
    });
    
  }

  public obtenerContacto(idContacto: number) {

    this.contactoService.obtenerContacto(idContacto, 'Contacto')
      .subscribe( (response: ContactoResponse) => {
        if (response.contacto.provincia === null || response.contacto.provincia === undefined) {
          response.contacto.provincia = new Provincia(0, '', new Region(0, '', new Pais(0, '', '', false)));
        } else { 
          $('#idRegion').val(response.contacto.provincia.region.idRegion);
          $('#idRegion').selectpicker('refresh')
          $('#idProvincia').val(response.contacto.provincia.idProvincia); 
          $('#idProvincia').selectpicker('refresh')
        }
        this.contacto = response.contacto;

        if (this.contacto.grupo !== null && this.contacto.grupo !== undefined) {
          $('#grupo').val(this.contacto.grupo.nombre);
        }

        $('#idPais').val(this.contacto.pais.idPais);
        $('#idPais').selectpicker('refresh')

        if (this.contacto.pais.idPais === ID_PAIS_GT) {
          $('#ubicacion').show();
          $("#idRegion").attr('required',true);
          $("#idProvincia").attr('required',true);
        } else {
          $('#ubicacion').hide();
          $("#idRegion").removeAttr('required',true);
          $("#idProvincia").removeAttr('required',true);
        }
        
      });
  }

  public obtenerProvincias(): Promise<Boolean> {
    return new Promise( (resolve, reject) => {
      this.provinciaService.obtenerProvincias('Contacto')
      .subscribe( (provincias: ProvinciaResponse) => {
        provincias.provincias.forEach( (provincia: Provincia) => {
          $('#idProvincia').append('<option value="' + provincia.idProvincia + '">' + provincia.nombre + '</option>')
        });
        $('#idProvincia').selectpicker('refresh');
        resolve(true);
      }, error => {
        reject(false);
      });
    });
  }

  public obtenerRegiones(): Promise<Boolean> {
    return new Promise( (resolve, reject) => {
      this.regionService.obtenerRegiones('contacto')
      .subscribe( (regiones: RegionResponse) => {
        regiones.regiones.forEach( (region: Region) => {
          $('#idRegion').append('<option value="' + region.idRegion + '">' + region.nombre + '</option>');
        });
        $('#idRegion').selectpicker('refresh');
        resolve(true);
      }, error => {
        reject(false);
      });
    });
  }

  public guardarContacto(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if ($('#grupo').val() !== '' && (this.contacto.grupo === null || this.contacto.grupo.idGrupo === null)) {
      Swal.fire({
        type: 'question',
        title: 'Crear nuevo grupo',
        text: `No seleccionaste un grupo de la lista, ¿deseas crear un nuevo grupo llamado "${$('#grupo').val()}"?`,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'No',
        confirmButtonText: 'Si, por favor'
      }).then(result => {
        if (result.value) {
          this.contacto.grupo = new Grupo(null, $('#grupo').val());
          this.contactoService.guardarContacto(this.contacto, 'contacto')
            .subscribe( (respuesta: Contacto) => {
              if (respuesta) {
                this.contacto = respuesta;
                this.router.navigate(['contact', respuesta.idContacto]);
              }
            });
          this.contacto = new Contacto(null, null, null, null, null, new Pais(null, null, null, null), new Provincia(null, null, new Region(null, null, null)), null, null);
        }
      });
    } else {
      this.contactoService.guardarContacto(this.contacto, 'contacto')
        .subscribe( (respuesta: Contacto) => {
          if (respuesta) {
            this.contacto = respuesta;
            this.router.navigate(['contact', respuesta.idContacto]);
          }
        });
      this.contacto = new Contacto(null, null, null, null, null, new Pais(null, null, null, null), new Provincia(null, null, new Region(null, null, null)), null, null);
    }
  }

}
