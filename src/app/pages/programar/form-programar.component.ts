import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactoService } from '../../services/contacto/contacto.service';
import { Contacto } from '../../models/contacto.model';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { NgForm } from '@angular/forms';
import { Notificacion } from '../../models/notificacion.model';
import { Canal } from '../../models/canal.model';
import { ModalPlantillaService } from '../../components/modal-plantillas/modal-plantilla.service';
import { Plantilla } from '../../models/plantilla.model';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { NotificacionResponse } from '../../interfaces/response/notificacionResponse.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { EstadoNotificacion } from '../../models/estadoNotificacion.model';
import { SPECIAL_KEYS } from '../../config/config';

declare var $: any;

@Component({
  selector: 'app-form-programar',
  templateUrl: './form-programar.component.html',
  styleUrls: ['./form-programar.component.css']
})
export class FormProgramarComponent implements OnInit {

  @ViewChild('selectMedio', {static: false}) calendarComponent; // the #calendar in the template
  @ViewChild('inputCliente', {static: false}) inputContacto;
  public contactos: Contacto[];
  public notificacion: Notificacion;
  public termino: string;

  constructor(
    private contactoService: ContactoService,
    public modalPlantillaService: ModalPlantillaService,
    public notificacionService: NotificacionesService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // Inicializando variables
    this.termino = '';
    this.contactos = [];
    this.notificacion = new Notificacion(null, null, null, null, null, null, null, [], new Canal(null, ''));


    // Jquery manipulacion del dom
    $('select').selectpicker();
    ($('.tagsinput') as any).tagsinput({itemValue: 'id', itemText: 'text'});
    $('.bootstrap-tagsinput').addClass('info-badge');
    $('.bootstrap-tagsinput').addClass('form-input-text');
    $('.bootstrap-tagsinput input').focus(event => {
      document.getElementById('myDropdown').classList.toggle('show');
    });
    $('.bootstrap-tagsinput input').keyup(event => {
      this.buscarContacto($('.bootstrap-tagsinput input').val());
    });
    $('#inputCliente').on('beforeItemAdd', event => {
      if (!event.item.id) {
        event.cancel = true;
      }
      $('.bootstrap-tagsinput input').val('');
    });
    $('#inputCliente').on('beforeItemRemove', event => {
      const tag = event.item;
      if (tag.id) {
        const index = this.notificacion.destinatarios.findIndex( contacto => {
          return contacto.idContacto === tag.id;
        });
        this.notificacion.destinatarios.splice(index, 1);
      }
   });

    this.activatedRoute.params.subscribe( params => {
      // tslint:disable-next-line: no-string-literal
      const fecha = new Date(params['date'].split('-')[0], Number(params['date'].split('-')[1]) - 1, params['date'].split('-')[2]);
      this.notificacion.fechaEnvio = fecha;

    });

    this.modalPlantillaService.notificacion
      .subscribe( (item: Plantilla) => {
          this.notificacion.titulo = item.titulo;
          this.notificacion.notificacion = item.plantilla;
      });
  }

  public buscarContacto(nombre: string) {

    if (nombre.trim().length <= 0) {
      return;
    }

    this.contactoService.buscarContactoPorNombre(nombre.trim(), 'programar notificacion')
      .subscribe( (contactos: ContactoResponse) => this.contactos = contactos.contactos);
  }

  public seleccionarContacto(contacto: Contacto) {

    if (!this.notificacion.destinatarios) {
      this.notificacion.destinatarios = [];
    }
    this.notificacion.destinatarios.push(contacto);

    $('#inputCliente').tagsinput('add', { id: contacto.idContacto, text: contacto.nombre });
    document.getElementById('myDropdown').classList.remove('show');
  }

  public guardarNotificacion(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this.notificacion.estado = new EstadoNotificacion(1, 'Programada');

    this.notificacionService.guardarNotificacion(this.notificacion, 'scheduleForm')
      .subscribe( (response: Notificacion) => {
          if (response) {
            this.router.navigate(['/notifications']);
          }
      });
  }

  public guardarBorrador() {

    this.notificacion.estado = new EstadoNotificacion(1, 'Creada');

    this.notificacionService.guardarNotificacion(this.notificacion, 'scheduleForm')
      .subscribe( (response: Notificacion) => {
        if (response) {
          this.router.navigate(['/notifications']);
        }
      });
  }

}
