import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';
import { USUARIO_STORAGE } from '../../config/config';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit {

  public usuario: Usuario;
  public imagenTemporal: string;
  public imagenSubir: File;

  constructor(
    public usuarioService: UsuarioService
  ) { }

  ngOnInit() {

    this.usuario = JSON.parse(localStorage.getItem(USUARIO_STORAGE));

  }

  public seleccionImagen(archivo) {
    console.log('Subir Imagen', archivo);

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
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario.idUsuario);
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

}
