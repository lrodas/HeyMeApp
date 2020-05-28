import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

import { URL_SERVICIOS, USUARIO_STORAGE, TOKEN_STORAGE, ID_USUARIO_STORAGE, PERMISOS } from '../../config/config';

import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

import { Usuario } from '../../models/usuario.model';
import { UsuarioRequest } from '../../interfaces/request/usuarioRequest.interface';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';

import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { CambioContrasenaRequest } from '../../interfaces/request/cambioContrasenaRequest.interface';
import { CambioContrasenaResponse } from '../../interfaces/response/cambioContrasenaResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;
  public token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  public crearUsuario(usuario: Usuario, recaptchaResponse: string, email: string, pagina: string) {
    const url = URL_SERVICIOS + '/user/save';
    const user: UsuarioRequest = {
      usuario: email,
      idUsuario: null,
      pagina,
      datos: usuario,
      recaptchaResponse
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, user, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {
        Swal.close();
        if (usuarioResponse.codigo === '0000') {
          Swal.fire({
            type: 'success',
            title: 'Registro exitoso',
            text: 'Tu usuario ha sido creado exitosamente, ahora podrás disfrutar de tus beneficios'
          });
          return true;
        } else if (usuarioResponse.codigo === '0058') {
          Swal.fire({
            type: 'error',
            title: 'Ups!',
            text: 'El correo electrónico que especificaste ya se encuentra registrado.'
          });
          return false;
        } else {
          Swal.fire({
            type: 'error',
            title: 'Ups!',
            text: 'Tenemos un problema con tu registro por favor intentalo mas tarde'
          });
          return false;
        }
        
      }),
      catchError( error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'Ups!',
          text: 'Tenemos un problema con tu registro por favor intentalo mas tarde'
        });
        return of([error]);
      })
    );
  }

  private cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  public logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem(TOKEN_STORAGE);
    localStorage.removeItem(USUARIO_STORAGE);
    localStorage.removeItem(ID_USUARIO_STORAGE);
    localStorage.removeItem(PERMISOS);

    this.router.navigate(['/login']);
  }

  public login( email: string, password: string, recordar: boolean = false) {
    if ( recordar ) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .pipe(  map( (resp: any) => {
      const user = resp.user;
      if (user) {
        this.obtenerUsuario(user.username, resp.token, 'login')
          .subscribe( (usuario: any) => {
            Swal.close();
            this.router.navigate(['/dashboard']);
            this.guardarStorage(usuario.usuario.idUsuario, resp.token, usuario.usuario);
          });
        return true;
      } else {
        return false;
      }

    }),
    catchError( error => {
      Swal.fire({
        type: 'error',
        title: 'Error al iniciar sesion',
        text: error.error.mensaje
      });

      return of([error]);
    }));
  }

  public estaLogueado() {
    return (this.token && this.token.length > 1) ? true : false;
  }

  public guardarStorage(id: number, token: string, usuario: Usuario) {
    localStorage.setItem(ID_USUARIO_STORAGE, id.toString());
    localStorage.setItem(TOKEN_STORAGE, token);
    localStorage.setItem(USUARIO_STORAGE, JSON.stringify(usuario));

    this.token = token;
    this.usuario = usuario;
  }

  public obtenerUsuario(email: string, token: string, pagina: string) {

    const url = URL_SERVICIOS + '/user/retrieveUserByUserName';
    const user: UsuarioRequest = {
      usuario: email,
      idUsuario: null,
      pagina,
      datos: { username: email }
    };

    return this.http.post(url, user, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
    }).pipe(
      map((usuarioResponse: UsuarioResponse) => {
        Swal.close();
        return usuarioResponse;
      }),
      catchError( error => {
        Swal.close();
        return of([error]);
      })
    );
  }

  public cambiarImagen(file: File, id: number) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    this.subirArchivoService.subirArchivo(file, '', id + '')
      .then( (resp: any) => {

        Swal.fire({
          type: 'success',
          title: 'Imagen actualizada exitosamente',
          text: ''
        });
        this.usuario.img = resp.img;
        localStorage.setItem(USUARIO_STORAGE, JSON.stringify(this.usuario));
        Swal.close();
      });
  }

  public actualizarUsuario(usuario: Usuario, pagina: string) {

    const url = URL_SERVICIOS + '/user/update';

    const request: UsuarioRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina,
      datos: usuario
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {
        Swal.close();
        return usuarioResponse;
      }),
      catchError( error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no ha sido posible actualizar tus datos',
          text: 'Por favor intenta nuevamente mas tarde'
        });
        return of([error]);
      })
    );
  }

  public obtenerUsuarios(pagina: string) {

    const url = URL_SERVICIOS + '/user/retrieveUsers';

    const request: UsuarioRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {
        Swal.close();
        return usuarioResponse;
      }),
      catchError( error => {
        Swal.close();
        return of([error]);
      })
    );
  }

  public cambiarEstado(usuario: Usuario, pagina: string) {

    const url = URL_SERVICIOS + '/user/changeStatus';

    const request: UsuarioRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina,
      datos: usuario
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {
        Swal.close();
        return usuarioResponse;
      }),
      catchError( error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no ha sido posible actualizar los datos',
          text: 'Por favor intenta nuevamente mas tarde'
        });
        return of([error]);
      })
    );
  }

  public obtenerUsuariosPorNombre(termino: string, pagina: string) {

    const url = URL_SERVICIOS + '/user/retrieveUsersByName';

    const request: UsuarioRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina,
      datos: new Usuario(null, termino)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {

        return usuarioResponse;
      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no ha sido posible consultar el usuario',
          text: 'Por favor intenta nuevamente mas tarde'
        });
        return of([error]);
      })
    );
  }

  public obtenerUsuariosPorFecha(fechaInicio: Date, fechaFin: Date, pagina: string) {

    const url = URL_SERVICIOS + '/user/retrieveUsersByDate';

    const request: UsuarioRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina,
      fechaInicio,
      fechaFin
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {
        Swal.fire({
          type: 'success',
          title: 'Usuarios obtenidos exitosamente',
          text: 'Usuarios obtenidos exitosamente'
        });
        Swal.close();
        return usuarioResponse;
      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no ha sido posible obtener los datos de los usuarios',
          text: 'Por favor intenta nuevamente mas tarde'
        });
        Swal.close();
        return of([error]);
      })
    );
  }

  public cambiarPassword(currentPassword: string, newPassword: string, pagina: string) {
    const url = URL_SERVICIOS + '/user/changePassword';

    const request: CambioContrasenaRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina,
      contrasenaActual: currentPassword,
      nuevaContrasena: newPassword
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (response: CambioContrasenaResponse) => {
        Swal.close();
        if (response.indicador === 'SUCCESS') {
          Swal.fire({
            type: 'success',
            title: 'Contraseña actualizada exitosamente',
            text: 'Contraseña actualizada exitosamente'
          });
        } else {
          Swal.fire({
            type: 'error',
            title: response.descripcion,
            text: 'No ha sido posible realizar el cambio de la contraseña, Por favor intenta nuevamente'
          });
        }

        return response;
      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no ha sido posible realizar el cambio de la contraseña',
          text: 'Por favor intenta nuevamente mas tarde'
        });
        Swal.close();
        return of([error]);
      })
    );
  }

  public activarUsuario(username: string, pagina: string) {
    const url = URL_SERVICIOS + '/user/activateUser';

    const request: UsuarioRequest = {
      usuario: '',
      idUsuario: 0,
      pagina,
      datos: new Usuario (null, null, null, null, null, null, username)
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request)
      .pipe(
        map((response: UsuarioResponse) => {
          if (response.codigo === "0000") {
            Swal.close();
            Swal.fire({
              type: 'success',
              title: 'Usuario activado con exito',
              text: 'Su usuario ha sido activado con exito, contacte con el administrador de su empresa'
            });
            return true;
          } else {
            Swal.close();
            Swal.fire({
              type: 'error',
              title: 'Error activando usuario',
              text: 'No hemos podido activar tu usuario, por favor intenta mas tarde'
            });
            return false;
          }
        }),
        catchError(error => {
          Swal.close();
          Swal.fire({
            type: 'error',
            title: 'Error activando usuario',
            text: 'No hemos podido activar tu usuario, por favor intenta mas tarde'
          });
          return of([error]);
        }));
  }

  public sendActivationMail(username: string, pagina: string) {
    const url = URL_SERVICIOS + '/user/sendActivationMail';

    const request: UsuarioRequest = {
      usuario: this.usuario.username,
      idUsuario: this.usuario.idUsuario,
      pagina,
      datos: new Usuario (null, null, null, null, null, null, username)
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    })
      .pipe(
        map((response: UsuarioResponse) => {
          if (response.codigo === "0000") {
            Swal.close();
            Swal.fire({
              type: 'success',
              title: 'Correo de activacion enviado con exito',
              text: `Se ha enviado el correo de activacion para el usuario: ${username}`
            });
            return true;
          } else {
            Swal.close();
            Swal.fire({
              type: 'error',
              title: 'Error enviando el correo de activacion',
              text: 'Ha ocurrido un error al enviar el correo de activacion, por favor intenta mas tarde'
            });
            return false;
          }
        }),
        catchError(error => {
          Swal.close();
          Swal.fire({
            type: 'error',
            title: 'Error enviando el correo de activacion',
            text: 'Ha ocurrido un error al enviar el correo de activacion, por favor intenta mas tarde'
          });
          return of([error]);
        }));
  }
}
