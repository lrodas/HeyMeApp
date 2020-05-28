import { Component, OnInit, OnChanges, ɵConsole } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';
import { Usuario } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS, ESTADO_USUARIO_BLOQUEADO, ESTADO_USUARIO_ACTIVO, ESTADO_USUARIO_INACTIVO, OPCION_CONTACTOS, OPCION_USUARIO } from '../../config/config';
import { RoleService } from '../../services/role/role.service';
import { RoleResponse } from '../../interfaces/response/roleResponse.interface';
import { Role } from '../../models/role.model';
import { EstadoUsuario } from 'src/app/models/EstadoUsuario.model';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public filtro: string;
  public usuarios: Usuario[];
  public fechaInicio: Date;
  public fechaFin: Date;
  public fechaActual: Date;
  public permisos: Permiso;
  public page: number;
  public estadoUsuarioActivo = ESTADO_USUARIO_ACTIVO;
  public estadoUsuarioBloqueado = ESTADO_USUARIO_BLOQUEADO;
  public estadoUsuarioInactivo = ESTADO_USUARIO_INACTIVO;

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
      .subscribe();
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

  public changeFiltro(filtro: string) {
    this.filtro = filtro;
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permisos = permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Usuarios';
    })[0];
  }

  public obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios(OPCION_USUARIO)
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

    this.usuarioService.obtenerUsuariosPorNombre(termino, OPCION_USUARIO)
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

  public eliminarUsuario(idUsuario: number, estado: number) {

    const usuario: Usuario = new Usuario(idUsuario, '', '', '', null, null, null, null, null, null, null, null, new EstadoUsuario(estado));

    this.usuarioService.cambiarEstado(usuario, 'Usuarios')
      .subscribe((usuarioResponse: UsuarioResponse) => {
        if (usuarioResponse.codigo === '0000') {
          Swal.fire({
            type: 'success',
            title: 'Datos actualizados exitosamente',
            text: 'Datos personales guardados exitosamente'
          }).then(result => {
            this.obtenerUsuarios();
          });
        }
      });
  }

  public sendActivationEmail(username: string) {
    this.usuarioService.sendActivationMail(username, OPCION_USUARIO)
      .subscribe();
  }
}
