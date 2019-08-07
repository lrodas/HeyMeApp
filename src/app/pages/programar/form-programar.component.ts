import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactoService } from '../../services/contacto/contacto.service';
import { Contacto } from '../../models/contacto.model';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { NgForm } from '@angular/forms';
import { Notificacion } from '../../models/notificacion.model';
import { Canal } from '../../models/canal.model';

declare var $: any;

@Component({
  selector: 'app-form-programar',
  templateUrl: './form-programar.component.html',
  styleUrls: ['./form-programar.component.css']
})
export class FormProgramarComponent implements OnInit {

  @ViewChild('selectMedio', {static: false}) calendarComponent; // the #calendar in the template
  public contactos: Contacto[];
  public notificacion: Notificacion;

  constructor(
    private contactoService: ContactoService
  ) {
  }

  ngOnInit() {
    $('select').selectpicker();
    this.contactos = [];
    this.notificacion = new Notificacion(null, null, null, null, null, null, null, new Contacto(null, '', ''), new Canal(null, ''));
  }

  public showAutoComplete(status: boolean) {
    if (status) {
      document.getElementById('myDropdown').classList.toggle('show');
    } else {
      document.getElementById('myDropdown').classList.remove('show');
    }
  }

  public buscarContacto(nombre: string) {

    if (nombre.trim().length <= 0) {
      return;
    }

    this.contactoService.buscarContactoPorNombre(nombre.trim(), 'programar notificacion')
      .subscribe( (contactos: ContactoResponse) => this.contactos = contactos.contactos);
  }

  public seleccionarContacto(contacto: Contacto) {
    this.notificacion.destinatario = contacto;

    document.getElementById('myDropdown').classList.remove('show');
  }

  public guardarNotificacion(form: NgForm) {
    console.log(this.notificacion);
  }

}
