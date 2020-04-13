import { Injectable } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class ModalEmpresaService {

  public oculto: string;
  public empresa: Empresa;
  
  constructor() {
    this.empresa = new Empresa();
    this.oculto = 'd-none';
  }
  
  public mostrarModal() {
    this.oculto = '';
  }

  public ocultarModal() {
    this.oculto = 'd-none';
  }

  public cancelarModal() {
    this.empresa = new Empresa();
    (document.getElementById('codigoEmpresa') as HTMLInputElement).disabled = false;
    this.ocultarModal();
  }
}
