import { Component, OnInit, OnChanges } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';
import { Usuario } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';
import { RoleService } from '../../services/role/role.service';
import { RoleResponse } from '../../interfaces/response/roleResponse.interface';
import { Role } from '../../models/role.model';

declare var $: any;

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
    public usuarioService: UsuarioService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
      this.filtro = 'fecha';
      this.obtenerUsuarios();
      this.fechaActual = new Date();
      this.fechaInicio = new Date();
      this.cargarPermisos();
      this.page = 1;
      $('select').selectpicker();
  }

  public guardarUsuario(usuario: Usuario) {
    usuario.role.descripcion = '';
    usuario.role.nombre = '';

    this.usuarioService.actualizarUsuario(usuario, 'Usuario')
      .subscribe( (response: UsuarioResponse) => {
        if (response.indicador === 'SUCCESS') {
          this.obtenerUsuarios();
        }
      });
  }

  public obtenerRoles(idUsuario: number): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      this.roleService.obtenerRolesActivos('usuarios')
      .subscribe( (response: RoleResponse) => {
        response.roles.forEach((role: Role) => {
          $('#role-' + idUsuario).append('<option value="' + role.idRole + '">' + role.descripcion + '</option>');
          $('#role-' + idUsuario).selectpicker('refresh');
        });
        resolve(true);
      }, error => {
        reject(false);
      });
    });
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
        this.usuarios.forEach( (usuario: Usuario) => {
          this.obtenerRoles(usuario.idUsuario)
            .then( response => $('#role-' + usuario.idUsuario).selectpicker('val', usuario.role.idRole));
        });
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
          this.obtenerUsuarios();
        }
      });
  }

}
