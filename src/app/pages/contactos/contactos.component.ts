import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { ContactoService } from '../../services/contacto/contacto.service';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styles: []
})
export class ContactosComponent implements OnInit {

  public filtro: string;
  public contactos: Contacto[];
  public parametros: FormGroup;
  public errorFechas: boolean;
  public page: number;
  public permisos: Permiso;

  constructor(
    private contactoService: ContactoService
  ) { }

  ngOnInit() {
    this.filtro = 'fecha';
    this.errorFechas = false;
    this.obtenerContactos();
    this.page = 1;
    this.parametros = new FormGroup({
      fechaInicio: new FormControl(null, Validators.required),
      fechaFin: new FormControl(null, Validators.required)
    });
    this.cargarPermisos();
  }

  public changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permisos = permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Lista de Contactos';
    })[0];
  }

  private obtenerContactos() {
    this.contactoService.obtenerTodosContactos('contactos')
      .subscribe((contactos: ContactoResponse) => {
        this.contactos = contactos.contactos;
      });
  }

  public buscarContato(nombre: string) {

    if (nombre.trim().length <= 0) {
      this.obtenerContactos();
      return;
    }

    this.contactoService.buscarContactoPorNombre(nombre, 'contactos')
      .subscribe( (contactos: ContactoResponse) => {
        this.contactos = contactos.contactos;
      });
  }

  public buscarContactoPorFecha() {

    const fechaInicio: Date = new Date(this.parametros.value.fechaInicio);
    const fechaFin: Date = new Date(this.parametros.value.fechaFin);

    if (fechaInicio.getTime() > fechaFin.getTime()) {
      this.errorFechas = true;
      return;
    } else {
      this.errorFechas = false;
    }

    this.contactoService.buscarContactosPorFecha(fechaInicio, fechaFin, 'contactos')
      .subscribe( (contactos: ContactoResponse) => {
          this.contactos = contactos.contactos;
      });
  }

  public cambiarEstadoContacto(contacto: Contacto, estado: boolean) {

    contacto.estado = estado;
    this.contactoService.guardarContacto(contacto, 'contactos')
      .subscribe();
  }
}
