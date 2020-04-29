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
import { Router, ActivatedRoute } from '@angular/router';
import { EstadoNotificacion } from '../../models/estadoNotificacion.model';
import { CanalService } from '../../services/canal/canal.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CANAL_SMS, CANAL_EMAIL, CANAL_WHATSAPP } from '../../config/config';

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
  public limiteCaracteres: number;
  public canales: Canal[];
  public Editor = ClassicEditor;
  public dataNotificacion: string;

  constructor(
    private contactoService: ContactoService,
    public modalPlantillaService: ModalPlantillaService,
    public notificacionService: NotificacionesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public canalService: CanalService
  ) { }

  ngOnInit() {
    // Inicializando variables
    this.termino = '';
    this.contactos = [];
    this.notificacion = new Notificacion(null, null, null, null, null, null, null, [], new Canal(null, ''));
    this.dataNotificacion = '';

    // Jquery manipulacion del dom
    ($('.tagsinput') as any).tagsinput({itemValue: 'id', itemText: 'text'});
    $('.bootstrap-tagsinput').addClass('info-badge');
    $('.bootstrap-tagsinput').addClass('form-input-text');
    $('.bootstrap-tagsinput input').focus(() => {
      document.getElementById('myDropdown').classList.toggle('show');
    });
    $('.bootstrap-tagsinput input').keyup(() => {
      this.buscarContacto($('.bootstrap-tagsinput input').val());
    });
    $('.bootstrap-tagsinput input').click(() => {
      document.getElementById('myDropdown').classList.toggle('show');
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

    $('.timepicker').datetimepicker({
      //          format: 'H:mm',
      // use this format if you want the 24hours timepicker
      format: 'H:mm', //use this format if you want the 12hours timpiecker with AM/PM toggle
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'

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

    this.canalService.obtenerCanalesActivos('Programar notificacion')
      .subscribe((canales: Canal[]) => {
        canales.forEach( (canal: Canal, i: number) => {
          if (i === 0) {
            $('#canal').append('<option selected value="' + canal.idCanal + '">' + canal.nombre + '</option>')
            this.cambioCanal(canal.idCanal);
          } else { 
            $('#canal').append('<option value="' + canal.idCanal + '">' + canal.nombre + '</option>')
          }
        });
        $('#canal').selectpicker('refresh');
      });

    this.limiteCaracteres = 150;
  }

  public cambioCanal(canal: Number) {
    if (canal === CANAL_SMS) {
      if (this.notificacion.notificacion && this.notificacion.notificacion.length > 150) {
        this.notificacion.notificacion = this.notificacion.notificacion.substring(0, 150);
      }
      this.limiteCaracteres = 150;
      document.getElementById('editor1').style.display = 'none';
      document.getElementById('editor2').style.display = 'block';
    } else if (canal === CANAL_EMAIL) {
      this.limiteCaracteres = 2500;
      document.getElementById('editor1').style.display = 'block';
      document.getElementById('editor2').style.display = 'none';
    } else if (canal === CANAL_WHATSAPP) {
      if (this.notificacion.notificacion && this.notificacion.notificacion.length > 150) {
        this.notificacion.notificacion = this.notificacion.notificacion.substring(0, 150);
      }
      this.limiteCaracteres = 150;
      document.getElementById('editor1').style.display = 'none';
      document.getElementById('editor2').style.display = 'block';
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
    this.notificacion.fechaEnvio.setHours($('#horaNotificacion')[0].value.split(':')[0], $('#horaNotificacion')[0].value.split(':')[1]);
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
