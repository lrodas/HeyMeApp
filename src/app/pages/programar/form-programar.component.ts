import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Contacto } from '../../models/contacto.model';
import { Grupo } from '../../models/grupo.model';
import { Canal } from '../../models/canal.model';
import { TagInput } from '../../models/tagInput.model';
import { Plantilla } from '../../models/plantilla.model';
import { Notificacion } from '../../models/notificacion.model';
import { EstadoNotificacion } from '../../models/estadoNotificacion.model';

import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';

import { ContactoService } from '../../services/contacto/contacto.service';
import { ModalPlantillaService } from '../../components/modal-plantillas/modal-plantilla.service';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { CanalService } from '../../services/canal/canal.service';
import { GrupoService } from '../../services/grupo/grupo.service';

import { CANAL_SMS, CANAL_EMAIL, CANAL_WHATSAPP, OPCION_PROGRAMAR_NOTIFICACION } from '../../config/config';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-form-programar',
  templateUrl: './form-programar.component.html',
  styleUrls: ['./form-programar.component.css']
})
export class FormProgramarComponent implements OnInit {

  @ViewChild('selectMedio', {static: false}) calendarComponent; // the #calendar in the template
  @ViewChild('inputContacto', {static: false}) inputContacto;
  @ViewChild('inputGrupo', {static: false}) inputGrupo;
  public contactos: TagInput[];
  public contactosSelecteds: TagInput[];
  public grupos: TagInput[];
  public gruposSelecteds: TagInput[];
  public notificacion: Notificacion;
  public termino: string;
  public limiteCaracteres: number;
  public canales: Canal[];
  public dataNotificacion: string;
  public agregarGrupos: boolean;
  private seleccionoPlantilla: boolean;

  constructor(
    private contactoService: ContactoService,
    public modalPlantillaService: ModalPlantillaService,
    public notificacionService: NotificacionesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public canalService: CanalService,
    public grupoService: GrupoService
  ) { }

  ngOnInit() {
    // Inicializando variables
    this.termino = '';
    this.contactos = [];
    this.contactosSelecteds = [];
    this.grupos = [];
    this.gruposSelecteds = [];
    this.notificacion = new Notificacion(null, null, null, null, null, null, null, [], new Canal(null, ''));
    this.dataNotificacion = '';
    this.agregarGrupos = false;
    this.seleccionoPlantilla = false;
    this.cambioTipoDestinatario('contactos');
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    // Jquery manipulacion del dom
    $('.timepicker').datetimepicker({
      //          format: 'H:mm',
      // use this format if you want the 24hours timepicker
      format: 'H:mm', // use this format if you want the 12hours timpiecker with AM/PM toggle
      icons: {
        time: 'fa fa-clock-o',
        minTime: time,
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
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
          this.seleccionoPlantilla = true;
          this.notificacion.titulo = item.titulo;
          this.notificacion.notificacion = item.plantilla;
      });

    this.canalService.obtenerCanalesActivos(OPCION_PROGRAMAR_NOTIFICACION)
      .subscribe((canales: Canal[]) => {
        $('#canal').append('<option>Selecciona un canal</option>');
        // this.cambioCanal(CANAL_EMAIL);
        canales.forEach( (canal: Canal, i: number) => {
          $('#canal').append('<option value="' + canal.idCanal + '">' + canal.nombre + '</option>');
        });
        $('#canal').selectpicker('refresh');
      });

    this.limiteCaracteres = 150;
  }

  public cambioTipoDestinatario(tipo: string) {
    this.notificacion.destinatarios = [];
    if (tipo === 'contactos') {
      this.agregarGrupos = false;
      if (this.contactos.length === 0) {
        this.obtenerContactos();
      }
    } else {
      this.agregarGrupos = true;
      if (this.grupos.length === 0) {
        this.obtenerGrupos();
      }
    }
  }

  public cambioCanal(canal: number) {
    if (Number(canal) === CANAL_SMS) {
      if (this.notificacion.notificacion && this.notificacion.notificacion.length > 150) {
        this.notificacion.notificacion = this.notificacion.notificacion.substring(0, 150);
      }
      this.limiteCaracteres = 150;
      document.getElementById('editor1').style.display = 'none';
      document.getElementById('editor2').style.display = 'block';
    } else if (Number(canal) === CANAL_EMAIL) {
      this.limiteCaracteres = 2500;
      document.getElementById('editor1').style.display = 'block';
      document.getElementById('editor2').style.display = 'none';
    } else if (Number(canal) === CANAL_WHATSAPP) {
      if (this.notificacion.notificacion && this.notificacion.notificacion.length > 150) {
        this.notificacion.notificacion = this.notificacion.notificacion.substring(0, 150);
      }
      this.limiteCaracteres = 150;
      document.getElementById('editor1').style.display = 'none';
      document.getElementById('editor2').style.display = 'block';
    }
  }

  public obtenerContactos() {
    this.contactoService.obtenerTodosContactos(OPCION_PROGRAMAR_NOTIFICACION)
      .subscribe((response: ContactoResponse) => {
        response.contactos.forEach((contacto: Contacto) => {
          this.contactos.push({display: contacto.nombre + ' ' + contacto.apellido, value: contacto.idContacto});
        });
      });
  }

  public obtenerGrupos() {
    this.grupoService.obtenerGrupos(OPCION_PROGRAMAR_NOTIFICACION)
      .subscribe((grupos: Grupo[]) => {
        grupos.forEach((grupo: Grupo) => {
          this.grupos.push(new TagInput(grupo.nombre, grupo.idGrupo));
        });
      });
  }

  public onAddGrupo(tag: TagInput) {
    this.contactoService.buscarContactosPorGrupo(tag.value, OPCION_PROGRAMAR_NOTIFICACION)
          .subscribe((contactos: Contacto[]) => {
            contactos.forEach(contacto => {
              const existe = this.notificacion.destinatarios.some((destinatario: Contacto) => {
                return destinatario.idContacto === contacto.idContacto;
              });

              if (!existe) {
                this.notificacion.destinatarios.push(contacto);
              }
            });
          });
  }

  public onAddContact(tag: TagInput) {
    this.notificacion.destinatarios.push(new Contacto(tag.value));
  }

  public guardarNotificacion(form: NgForm) {

    if (form.invalid) {
      return;
    }

    if (!this.notificacion.destinatarios || this.notificacion.destinatarios.length <= 0) {
      Swal.fire({
        type: 'error',
        title: 'Sin destinatarios',
        text: `Debes agregar por lo menos un contacto para enviar la notificacion`,
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (Number(this.notificacion.canal.idCanal) === CANAL_WHATSAPP && !this.seleccionoPlantilla) {
      Swal.fire({
        type: 'error',
        title: 'La plantilla es obligatoria',
        text: `Debes seleccionar una plantilla para programar una notificacion por whatsapp`,
        showConfirmButton: false,
        timer: 3000
      });
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
