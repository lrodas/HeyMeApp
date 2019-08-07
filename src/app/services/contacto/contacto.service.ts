import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ContactoRequest } from '../../interfaces/request/contactoRequest.interface';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { UsuarioService } from '../usuario-service/usuario.service';
import { Contacto } from '../../models/contacto.model';

import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private prefixUrl = '/contact';

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
  ) { }

  public buscarContactoPorNombre(nombre: string, pagina: string) {

    const url = URL_SERVICIOS + this.prefixUrl + '/findByName';

    const request: ContactoRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      contacto: new Contacto(null, nombre)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public guardarContacto (contacto: Contacto, pagina: string) {

    const url = URL_SERVICIOS + '/contact/save';

    const contactoRequest: ContactoRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      contacto
    };

    return this.http.post(url, contactoRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: ContactoResponse) => {

        if (response.indicador === 'SUCCESS') {
            Swal.fire({
              type: 'success',
              title: 'Contacto guardado exitosamente',
              text: `El contacto ${contacto.nombre} fue guardado con exito`,
              showConfirmButton: false,
              timer: 3000
            });
            return true;
        } else {
          Swal.fire({
            type: 'error',
            title: 'No pudimos guardar el contacto',
            text: `En estos momentos no fue posible guardar el contacto: ${contacto.nombre}, por favor intenta mas tarde`,
            showConfirmButton: false,
            timer: 3000
          });
          return false;
        }

      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'No pudimos guardar el contacto',
          text: `En estos momentos no fue posible guardar el contacto: ${contacto.nombre}, por favor intenta mas tarde`,
          showConfirmButton: false,
          timer: 3000
        });
        return of(error);
      })
    );
  }
}
