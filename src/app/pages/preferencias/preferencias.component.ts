import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empresa } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { OPCION_EMPRESA_INFO, PERMISOS } from '../../config/config';
import { EmpresaResponse } from '../../interfaces/response/empresaResponse.interface';
import { Permiso } from '../../models/permiso.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styles: []
})
export class PreferenciasComponent implements OnInit {

  public empresa: Empresa;
  public imagenTemporal: string;
  public imagenSubir: File;

  constructor(
    private empresaService: EmpresaService
  ) { 
    this.empresa = new Empresa();
  }

  ngOnInit() {
    this.obtenerEmpresa();
  }

  public seleccionImagen(archivo) {

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      this.imagenSubir = null;
      Swal.fire('Imagenes unicamente', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemporal = <string> reader.result;
  }

  public cambiarImagen() {
    this.empresaService.cambiarLogo(this.imagenSubir, this.empresa.idEmpresa);
  }

  private obtenerEmpresa () {
    this.empresaService.obtenerEmpresa(OPCION_EMPRESA_INFO)
      .subscribe((response: EmpresaResponse) => this.empresa = response.empresa);
  }

  public guardarEmpresa(form: NgForm) {

    if (form.invalid || (!this.permisoEmpresa().cambio && !this.permisoEmpresa().alta)) {
      return;
    }

    this.empresaService.guardarEmpresa(this.empresa, OPCION_EMPRESA_INFO)
      .subscribe();
  }

  public permisoEmpresa() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    return permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === OPCION_EMPRESA_INFO;
    })[0];
  }

}
