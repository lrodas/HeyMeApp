import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

import { URL_SERVICIOS, USUARIO_STORAGE, TOKEN_STORAGE, ID_USUARIO_STORAGE } from '../../config/config';

import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

import { Usuario } from '../../models/usuario.model';
import { UsuarioRequest } from '../../interfaces/request/usuarioRequest.interface';
import { UsuarioResponse } from '../../interfaces/response/usuarioResponse.interface';

import Swal from 'sweetalert2';
import { of } from 'rxjs';

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
      text: 'Espere por favor'
    });

    Swal.showLoading();

    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .pipe(  map( (resp: any) => {
      const user = resp.user;
      console.log(user);
      if (user) {
        this.obtenerUsuario(user.username, resp.token, 'login')
          .subscribe( (usuario: any) => {
            Swal.close();
            this.router.navigate(['/dashboard']);
            console.log(usuario.usuario);
            this.guardarStorage(usuario.usuario.idUsuario, resp.token, usuario.usuario);
          });
        return true;
      } else {
        return false;
      }

    }),
    catchError( error => {
      console.log(error);

      Swal.fire({
        type: 'error',
        title: 'Error al iniciar sesion',
        text: error.error.mensaje
      });

      return of([error]);
    }));
  }

  estaLogueado() {
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
    });
  }

  public cambiarImagen(file: File, id: number) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor'
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
      text: 'Espere por favor'
    });

    Swal.showLoading();

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.token)
    }).pipe(
      map( (usuarioResponse: UsuarioResponse) => {
        Swal.fire({
          type: 'success',
          title: 'Datos actualizados exitosamente',
          text: 'Datos personales guardados exitosamente'
        });
        return usuarioResponse;
      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'En estos momentos no ha sido posible actualizar tus datos',
          text: 'Por favor intenta nuevamente mas tarde'
        });
        return of([error]);
      })
    );
  }

}