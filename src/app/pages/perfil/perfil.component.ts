import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';
import { USUARIO_STORAGE } from '../../config/config';
import { CambioContrasenaResponse } from '../../interfaces/response/cambioContrasenaResponse.interface';
import { Genero } from 'src/app/models/genero.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit {

  public usuario: Usuario;
  public imagenTemporal: string;
  public imagenSubir: File;
  public contrasena: string;
  public nuevaContrasena: string;
  public strClassErrorPassVerification: string;
  public strClassErrorPass: string;
  @ViewChild('lblErrorPassword') lblError: ElementRef;
  @ViewChild('inputValidatePassword') inputValidatePassword: ElementRef;

  constructor(
    public usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.imagenTemporal = undefined;
    this.usuario = JSON.parse(localStorage.getItem(USUARIO_STORAGE));
    if (!this.usuario.genero) {
      this.usuario.genero = new Genero();
    }
    this.strClassErrorPass = 'd-none';
    this.strClassErrorPassVerification = 'd-none';

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
    reader.onloadend = () => this.imagenTemporal = reader.result as string;
  }

  public cambiarImagen() {
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario.idUsuario);
  }

  public validatePassword(e: any) {
    if (!this.nuevaContrasena || this.nuevaContrasena.trim().length === 0) {
      this.strClassErrorPass = '';
    } else {
      this.strClassErrorPass = 'd-none';
    }

    if (e.srcElement.value !== this.nuevaContrasena) {
      this.strClassErrorPassVerification = '';
    } else {
      this.strClassErrorPassVerification = 'd-none';
    }
  }

  public actualizarUsuario(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this.usuarioService.actualizarUsuario(this.usuario, 'perfil')
      .subscribe( (usuario: UsuarioResponse) => {
        localStorage.setItem(USUARIO_STORAGE, JSON.stringify(this.usuario));
      });

  }

  public cambiarPassword() {

    if (this.nuevaContrasena !== this.inputValidatePassword.nativeElement.value) {
      return;
    }

    this.usuarioService.cambiarPassword(this.contrasena, this.nuevaContrasena, 'Perfil')
      .subscribe( (response: CambioContrasenaResponse) => {
        if (response.indicador === 'SUCCESS') {
          this.contrasena = '';
          this.nuevaContrasena = '';
          this.inputValidatePassword.nativeElement.value = '';
        }
      });
  }
}
