import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { ContactoService } from '../../services/contacto/contacto.service';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS, OPCION_CONTACTOS } from '../../config/config';
import { HostListener } from '@angular/core';
import { Grupo } from 'src/app/models/grupo.model';
import Swal from 'sweetalert2';

import * as XLSX from 'ts-xlsx';
import { Pais } from 'src/app/models/pais.model';
import { Provincia } from 'src/app/models/provincia.model';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  public filtro: string;
  public contactos: Contacto[];
  public parametros: FormGroup;
  public errorFechas: boolean;
  public page: number;
  public permisos: Permiso;
  public screenHeight: number;
  public screenWidth: number;
  public grupos: Grupo[];
  public archivoExcel: File;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.screenHeight = window.innerHeight;
     this.screenWidth = window.innerWidth;
  }

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
    this.onResize();
  }

  public changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permisos = permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === OPCION_CONTACTOS;
    })[0];
  }

  private obtenerContactos() {
    this.contactoService.obtenerTodosContactos('contactos')
      .subscribe((contactos: ContactoResponse) => {
        this.contactos = contactos.contactos;
      });
  }

  public buscarPorGrupo(nombre: string) {
    if (nombre.trim().length <= 0) {
      this.obtenerContactos();
      return;
    }

    this.contactoService.buscarContactoPorNombreGrupo(nombre, OPCION_CONTACTOS)
      .subscribe((contactos: Contacto[]) => this.contactos = contactos);
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

  public subirArchivo(archivo) {

    if (!archivo) {
      this.archivoExcel = null;
      return;
    }

    if (archivo.name.substr(archivo.name.lastIndexOf('.') + 1) !== 'xls' &&
      archivo.name.substr(archivo.name.lastIndexOf('.') + 1) !== 'xlsx') {
      Swal.fire({
        type: 'warning',
        title: 'Tipo de archivo incorrecto',
        text: `El archivo seleccionado no es un archivo de excel, por favor verificar`,
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    const reader = new FileReader();
    let arrayBuffer: any;

    reader.onload = e => {
      arrayBuffer = reader.result;
      const data = new Uint8Array(arrayBuffer);
      const arrData = new Array();

      for (let i = 0; i < data.length; ++i) {
        arrData[i] = String.fromCharCode(data[i]);
      }

      const workbook = XLSX.read(arrData.join(''), {type: 'binary'});

      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { raw: true});

      if (!jsonData || jsonData.length <= 0) {
        Swal.fire({
          type: 'warning',
          title: 'Archivo sin informacion',
          text: `El archivo seleccionado no contiene informacion, por favor verificar`,
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }

      const contactos: Contacto[] = [];
      const regexEmail: RegExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      const dataError: any[] = [];

      jsonData.forEach((datos: any, i: number) => {

        const index = i + 2;

        if (!datos.NOMBRES || datos.NOMBRES.length <= 0) {
          dataError.push(`El nombre del contacto en la linea ${index} es obligatorio, por favor verificar`);
        }
        if (!datos.APELLIDOS || datos.APELLIDOS.length <= 0) {
          dataError.push(`El apellido del contacto en la linea ${index} es obligatorio, por favor verificar`);
        }
        if (!datos.DIRECCION || datos.DIRECCION.length <= 0) {
          dataError.push(`La direccion del contacto en la linea ${index} es obligatorio, por favor verificar`);
        }
        if (datos['CORREO ELECTRONICO'] && (datos['CORREO ELECTRONICO'].length === 0 || !regexEmail.test(datos['CORREO ELECTRONICO']))) {
          dataError.push(`El correo que se especifica en el contacto de la linea ${index} no es valido, por favor verifique el formato`);
        }
        if (!datos.TELEFONO || datos.TELEFONO.length <= 0) {
          dataError.push(`El telefono del contacto en la linea ${index} es obligatorio, por favor verificar`);
        }
        if (!datos.ESTADO || typeof datos.ESTADO === 'string' || datos.ESTADO < 0 && datos.ESTADO > 1) {
          dataError.push(`El estado del contacto en la linea ${index} no es valido, por favor verificar`);
        }
        if (!datos.PAIS || typeof datos.PAIS === 'string' || datos.PAIS < 0) {
          dataError.push(`El pais del contacto en la linea ${index} no es valido, por favor verificar`);
        }
        if (datos.PROVINCIA && (typeof datos.PROVINCIA === 'string' || datos.PROVINCIA <= 0)) {
          dataError.push(`La provincia que se especifica en el contacto de la linea ${index} no es valida, por favor ferifique el formato`);
        }
        if (dataError.length === 0) {
          const contacto = new Contacto();
          contacto.nombre = datos.NOMBRES;
          contacto.apellido = datos.APELLIDOS;
          contacto.direccion = datos.DIRECCION;
          contacto.telefono = datos.TELEFONO;
          contacto.email = datos['CORREO ELECTRONICO'];
          contacto.estado = datos.ESTADO;
          contacto.pais = new Pais(datos.PAIS);
          contacto.provincia = new Provincia(datos.PROVINCIA);

          if (datos.GRUPO) {
            contacto.grupo = new Grupo(null, datos.GRUPO);
          }
          contactos.push(contacto);
        }
      });

      if (dataError.length > 0) {

        let errorsHTML = '<ul>';
        dataError.forEach(text => {
          errorsHTML += `<li>${text}</li><br/>`;
        });
        errorsHTML += '</ul>';

        Swal.fire({
          type: 'error',
          width: 900,
          title: 'Hemos encontrado algunos errores en el archivo',
          html: errorsHTML,
          showConfirmButton: true
        });
      } else {
        this.contactoService.guardarContactos(contactos, OPCION_CONTACTOS)
          .subscribe((response: boolean) => {
            this.obtenerContactos();
          });
      }
    };

    reader.readAsArrayBuffer(archivo);

    return;
    /*

    this.imagenSubir = archivo;
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemporal = <string> reader.result;*/
  }

  public descargarPlantilla() {
    this.contactoService.descargarPlantillaContactos(OPCION_CONTACTOS)
      .subscribe( x => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([x], { type: 'application/pdf' });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        link.download = `carga_masiva_contactos.xlsx`;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout( () => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
        }, 100);
    });
  }
}
