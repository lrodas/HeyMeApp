import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS, ID_PAIS_GT } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ContactoRequest } from '../../interfaces/request/contactoRequest.interface';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { UsuarioService } from '../usuario-service/usuario.service';
import { Contacto } from '../../models/contacto.model';

import Swal from 'sweetalert2';
import { Provincia } from 'src/app/models/provincia.model';
import { Region } from 'src/app/models/region.model';
import { Pais } from 'src/app/models/pais.model';
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
    }).pipe(
      map( (response: ContactoResponse) => {
        response.contactos.forEach( (contacto) => {
          if (contacto.provincia === null || contacto.provincia === undefined) {
            contacto.provincia = new Provincia(0, '', new Region(0, '', new Pais(0, '', '', false)));
          }
        });
        return response;
      })
    );
  }

  public guardarContacto(contacto: Contacto, pagina: string) {

    const url = URL_SERVICIOS + '/contact/save';

    if (contacto.pais.idPais !== ID_PAIS_GT) {
      contacto.provincia = null;
    }

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
            if (response.contacto.provincia === null || response.contacto.provincia === undefined) {
              response.contacto.provincia = new Provincia(0, '', new Region(0, '', new Pais(0, '', '', false)));
            }
            return response.contacto;
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

  public obtenerContacto(idContacto: number, pagina: string) {
    const url = URL_SERVICIOS + '/contact/findById';

    const contactoRequest: ContactoRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      contacto: new Contacto(idContacto)
    };

    return this.http.post(url, contactoRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (response: ContactoResponse) => {
        if (response.contacto.provincia === null || response.contacto.provincia === undefined) {
          response.contacto.provincia = new Provincia(0, '', new Region(0, '', new Pais(0, '', '', false)));
        }

        return response;
      })
    );
  }

  public obtenerTodosContactos(pagina: string) {

    const url = URL_SERVICIOS + '/contact/findAll';

    const contactoRequest: ContactoRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina
    };

    return this.http.post(url, contactoRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (response: ContactoResponse) => {
        response.contactos.forEach( (contacto) => {
          if (contacto.provincia === null || contacto.provincia === undefined) {
            contacto.provincia = new Provincia(0, '', new Region(0, '', new Pais(0, '', '', false)));
          }
        });
        return response;
      })
    );
  }

  public buscarContactosPorFecha(fechaInicio: Date, fechaFin: Date, pagina: string) {

    const url = URL_SERVICIOS + '/contact/findByCreationDate';

    const contactoRequest: ContactoRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      fechaInicio,
      fechaFin
    };
    
    return this.http.post(url, contactoRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (response: ContactoResponse) => {
        response.contactos.forEach( (contacto) => {
          if (contacto.provincia === null || contacto.provincia === undefined) {
            contacto.provincia = new Provincia(0, '', new Region(0, '', new Pais(0, '', '', false)));
          }
        });
        return response;
      })
    );
  }
}
