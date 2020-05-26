import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empresa } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { OPCION_EMPRESA_INFO, PERMISOS } from '../../config/config';
import { EmpresaResponse } from '../../interfaces/response/empresaResponse.interface';
import { Permiso } from '../../models/permiso.model';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styles: []
})
export class PreferenciasComponent implements OnInit {

  public empresa: Empresa;

  constructor(
    private empresaService: EmpresaService
  ) { 
    this.empresa = new Empresa();
  }

  ngOnInit() {
    this.obtenerEmpresa();
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
