import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {

  public regiones: Region[];
  public provincias: Provincia[];
  public contacto: Contacto;

  constructor(
    public regionService: RegionService,
    public provinciaService: ProvinciaService,
    public contactoService: ContactoService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];
      if (id !== 'new') {
        this.obtenerContacto(id);
      }
    });

  }

  ngOnInit() {
    this.obtenerRegiones();
    this.obtenerProvincias();
    this.provincias = [];
    this.contacto = new Contacto(null, null, null, null, null, new Provincia(null, null, new Region(null, null, null)), null, null);
  }

  public obtenerContacto(idContacto: number) {

    this.contactoService.obtenerContacto(idContacto, 'Contacto')
      .subscribe( (response: ContactoResponse) => {
        this.contacto = response.contacto;
      });
  }

  public obtenerProvincias(){
    this.provinciaService.obtenerProvincias('Contacto')
      .subscribe( (provincias: ProvinciaResponse) => {
        this.provincias = provincias.provincias;
      });
  }

  public obtenerRegiones() {
    this.regionService.obtenerRegiones('contacto')
      .subscribe( (regiones: RegionResponse) => {
        this.regiones = regiones.regiones;
      });
  }

  public obtenerProvincia(idRegion: number) {

    if (!Number(idRegion)) {
      return;
    }

    this.provinciaService.obtenerProvinciaPorRegion(idRegion, 'contacto')
      .subscribe((response: ProvinciaResponse) => {
        this.provincias = response.provincias;
      });
  }

  public guardarContacto(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.contactoService.guardarContacto(this.contacto, 'contacto')
      .subscribe( respuesta => {
        if (respuesta) {
          this.router.navigate(['contact', respuesta.idContacto]);
        }
      });
  }

}
