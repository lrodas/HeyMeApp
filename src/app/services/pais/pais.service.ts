import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario-service/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { PaisRequest } from '../../interfaces/request/paisRequest.interface';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaisResponse } from '../../interfaces/response/paisResponse.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) { }

  public obtenerPaises(pagina: string) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    const url = URL_SERVICIOS + '/country/findAll';

    const request: PaisRequest = {
      idUsuario: this.usuarioService.usuario.idUsuario,
      usuario: this.usuarioService.usuario.username,
      pagina
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: PaisResponse) => {
        Swal.close();
        return response;
      }),
      catchError( error => {
        Swal.close();
        return of(error);
      })
    );
  }
}
