import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';
import { Usuario } from '../../models/usuario.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgForm } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  public filtro: string;
  public usuarios: Usuario[];
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: Date;
  public permisos: Permiso;
  public page: number;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.filtro = 'fecha';
    this.obtenerUsuarios();
    this.fechaActual = new Date();
    this.fechaInicio = new Date();
    this.cargarPermisos();
    this.page = 1;
  }

  changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permisos = permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Usuarios';
    })[0];
  }

  public obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios('usuarios')
      .subscribe( (usuarioResponse: UsuarioResponse) => {
        this.usuarios = usuarioResponse.usuarios;
      });
  }

  public obtenerUsuariosPorNombre(termino: string) {

    if (!termino) {
      return;
    }

    this.usuarioService.obtenerUsuariosPorNombre(termino, 'Usuarios')
      .subscribe( (response: UsuarioResponse) => {
        this.usuarios = response.usuarios;
      });
  }

  public obtenerUsuarioPorFecha(form: NgForm) {

    if (!this.fechaInicio || !this.fechaFin) {
      return;
    }

    if (form.invalid) {
      return;
    }

    this.usuarioService.obtenerUsuariosPorFecha(this.fechaInicio, this.fechaFin, 'Usuarios')
      .subscribe( (response: UsuarioResponse) => {
        this.usuarios = response.usuarios;
      });
  }

  public eliminarUsuario(idUsuario: number, estado: boolean) {

    const usuario: Usuario = new Usuario(idUsuario, '', '', '', null, null, null, null, null, null, estado);

    this.usuarioService.cambiarEstado(usuario, 'Usuarios')
      .subscribe( (response: Usuario) => {
        if (response) {
          const index: number = this.usuarios.findIndex(item => item.idUsuario == response.idUsuario);
          this.usuarios[index] = response;
        }
      });
  }

}
