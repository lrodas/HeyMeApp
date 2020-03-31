import { Component, OnInit } from '@angular/core';
import { ModalEmpresaService } from './modal-empresa.service';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.css']
})
export class ModalEmpresaComponent implements OnInit {

  public oculto: string;

  constructor(
    public modalEmpresaService: ModalEmpresaService
  ) { }

  ngOnInit() {
    this.oculto = '';
  }

  public ocultarModal() {
    this.oculto = 'd-none';
  }

  public mostrarModal() {
    this.oculto = '';
  }

}
