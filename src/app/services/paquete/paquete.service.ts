import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { UsuarioService } from '../usuario-service/usuario.service';

import { URL_SERVICIOS } from '../../config/config';
import { PaqueteRequest } from '../../interfaces/request/paqueteRequest.interface';
import { PaqueteResponse } from '../../interfaces/response/paqueteResponse.interface';
import { Paquete } from '../../models/paquete.model';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) { }

  public obtenerPaquetesActivos(pagina: string) {
    const url = URL_SERVICIOS + '/package/retrieveAvaiblePackage';

    const request: PaqueteRequest = {
      idUsuario: this.usuarioService.usuario.idUsuario,
      usuario: this.usuarioService.usuario.username,
      pagina
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: PaqueteResponse) => {
        Swal.close();
        if (response.codigo == '0000') {
          return response.paquetes;
        } else {
          return [];
        }
      }),
      catchError( error => {
        return of([error]);
      })
    );
  }

  public activarPaquete(pagina: string, paquete: number, nombrePaquete: string, jsonResponse: string) {
    const url = URL_SERVICIOS + '/package/saveConsumption';

    const request: PaqueteRequest = {
      idUsuario: this.usuarioService.usuario.idUsuario,
      usuario: this.usuarioService.usuario.username,
      pagina,
      paquete: new Paquete(paquete),
      jsonResponse
    };

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: PaqueteResponse) => {
        Swal.close();
        if (response.codigo == '0000') {
         
          Swal.close();
          Swal.fire({
            type: 'success',
            title: 'Paquete activado exitosamente',
            text: `El paquete ${nombrePaquete} fue activado exitosamente, y ahora podra disfrutar de sus beneficions`,
            showConfirmButton: false,
            timer: 3000
          });
          return true;
        } else {
          return false;
        }
      }),
      catchError( error => {
        return of([error]);
      })
    );
  }
}
