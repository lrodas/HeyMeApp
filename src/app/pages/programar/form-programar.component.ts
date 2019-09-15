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
    private contactoService: ContactoService,
    public modalPlantillaService: ModalPlantillaService,
    public notificacionService: NotificacionesService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    $('select').selectpicker();
    this.contactos = [];
    this.notificacion = new Notificacion(null, null, null, null, null, null, null, new Contacto(null, '', ''), new Canal(null, ''));

    this.activatedRoute.params.subscribe( params => {
      // tslint:disable-next-line: no-string-literal
      const fecha = new Date(params['date']);
      this.notificacion.fechaEnvio = fecha;

    });

    this.modalPlantillaService.notificacion
      .subscribe( (item: Plantilla) => {
          this.notificacion.titulo = item.titulo;
          this.notificacion.notificacion = item.plantilla;
      });
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

    if (form.invalid) {
      return;
    }

    this.notificacion.estado = new EstadoNotificacion(2, 'Programada');

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
        console.log(response);
        if (response) {
          this.router.navigate(['/notifications']);
        }
      });
  }

}
