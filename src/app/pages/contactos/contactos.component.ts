import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { ContactoService } from '../../services/contacto/contacto.service';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  }

  public changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  private obtenerContactos() {
    this.contactoService.obtenerTodosContactos('contactos')
      .subscribe((contactos: ContactoResponse) => {
        this.contactos = contactos.contactos;
      });
  }

  public buscarContato(nombre: string) {

    if (nombre.trim().length <= 0) {
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
      console.log(this.parametros);
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
