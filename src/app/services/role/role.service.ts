import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { RoleRequest } from '../../interfaces/request/roleRequest.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { RoleResponse } from '../../interfaces/response/roleResponse.interface';
import { of } from 'rxjs';
import { Role } from '../../models/role.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    public usuarioService: UsuarioService,
    public http: HttpClient
  ) { }

  public cambiarEstado(pagina: string, id: number, estado: boolean) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    const url = URL_SERVICIOS + '/role/changeStatus';

    const request: RoleRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      role: new Role(id, '', '', estado, null)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (roleResponse: RoleResponse) => {
        if (roleResponse.indicador === 'SUCCESS') {

          Swal.fire({
            type: 'success',
            title: 'Role actualizado exitosamente',
            text: `El role ${ roleResponse.role.descripcion } fue actualizado con exito`,
            showConfirmButton: false,
            timer: 3000
          });

          return roleResponse.role;
        } else {
          return false;
        }
      }),
      catchError( error => {
        return of([error]);
      })
    );
  }

  public obtenerRolesActivos(pagina: string) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    const url = URL_SERVICIOS + '/role/findAll';

    const request: RoleRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      role: new Role(null, null, null, true)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (roleResponse: RoleResponse) => {
        Swal.close();
        return roleResponse;
      }),
      catchError( error => {
        Swal.close();
        return of([error]);
      })
    );
  }

  public obtenerRoles(pagina: string) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    const url = URL_SERVICIOS + '/role/findAll';

    const request: RoleRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (roleResponse: RoleResponse) => {
        Swal.close();
        return roleResponse;
      }),
      catchError( error => {
        Swal.close();
        return of([error]);
      })
    );
  }

  public obtenerRolesPorNombre(termino: string, pagina: string) {

    const url = URL_SERVICIOS + '/role/findByName';

    const request: RoleRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      role: new Role(null, '', termino)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerRolePorId(idRole: number, pagina: string) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    const url = URL_SERVICIOS + '/role/findById';

    const request: RoleRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      role: new Role(idRole)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (roleResponse: RoleResponse) => {
        Swal.close();
        return roleResponse;
      }),
      catchError( error => {
        Swal.close();
        return of([error]);
      })
    );
  }

  public guardarRole(role: Role, pagina: string) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    const url = URL_SERVICIOS + '/role/save';

    const request: RoleRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      role
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (roleResponse: RoleResponse) => {
        Swal.close();

        Swal.fire({
          type: 'success',
          title: 'Contacto guardado exitosamente',
          text: `El contacto ${role.descripcion} fue guardado con exito`,
          showConfirmButton: false,
          timer: 3000
        });
        return roleResponse;
      }),
      catchError( error => {
        Swal.close();

        Swal.fire({
          type: 'error',
          title: 'No pudimos guardar el role',
          text: `En estos momentos no fue posible guardar el role: ${role.descripcion}, por favor intenta mas tarde`,
          showConfirmButton: false,
          timer: 3000
        });

        return of([error]);
      })
    );
  }
}
