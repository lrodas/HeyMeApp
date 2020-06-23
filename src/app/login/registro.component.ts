import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Role } from '../models/role.model';
import { Genero } from '../models/genero.model';
import { Empresa } from '../models/empresa.model';
import { NgForm } from '@angular/forms';
import { ModalEmpresaService } from '../components/modal-empresa/modal-empresa.service';
import { LoginComponent } from './login.component';
import { UsuarioService } from '../services/usuario-service/usuario.service';
import { UsuarioResponse } from '../interfaces/response/usuarioResponse.interface';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public usuario: Usuario;
  public errorTerminos: boolean;
  public errorCodigoEmpresa: boolean;
  public errorPasswordMatch: boolean;
  public errorRecaptcha: boolean;
  public recaptchaResponse: string;
  public dataKey: string;
  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

  constructor(
    private modalEmpresaService: ModalEmpresaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuario = new Usuario(null, '', '', '', null, new Role(), '', '', '', new Genero(), null, new Empresa());
    this.errorTerminos = false;
    this.errorCodigoEmpresa = false;
    this.errorRecaptcha = false;
    this.dataKey = environment.dataSiteKey;
  }

  public guardar(form: NgForm) {

    if (form.invalid) {
      return;
    }

    if (!this.recaptchaResponse) {
      this.errorRecaptcha = true;
    } else {
      this.errorRecaptcha = false;
    }

    if (this.usuario.password !== (document.getElementById('confirmPassword') as HTMLInputElement).value) {
      this.errorPasswordMatch = true;
    } else {
      this.errorPasswordMatch = false;
    }

    if (this.modalEmpresaService.empresa.nombreEmpresa === undefined && this.usuario.empresa.codigo === undefined) {
      this.errorCodigoEmpresa = true;
    } else {
      this.errorCodigoEmpresa = false;
    }

    if ((document.getElementById('terminos') as HTMLInputElement).checked === false) {
      this.errorTerminos = true;
    } else {
      this.errorTerminos = false;
    }

    if (this.errorCodigoEmpresa || this.errorCodigoEmpresa || this.errorTerminos || form.invalid || this.errorRecaptcha) {
      return;
    }

    if (this.usuario.empresa.codigo === undefined) {
      this.usuario.empresa = this.modalEmpresaService.empresa;
    }

    this.usuarioService.crearUsuario(this.usuario, this.recaptchaResponse, 'registro', 'registro')
      .subscribe((response: boolean) => {
        if (response) {
          this.router.navigate(['/login']);
        }
      });
  }

  public mostrarModal() {

    (document.getElementById('codigoEmpresa') as HTMLInputElement).disabled = true;
    (document.getElementById('codigoEmpresa') as HTMLInputElement).value = '';
    this.modalEmpresaService.mostrarModal();
  }

  public resolved(captchaResponse: string) {
    this.recaptchaResponse = captchaResponse;
  }

}
