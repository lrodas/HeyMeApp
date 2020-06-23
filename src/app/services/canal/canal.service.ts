import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { CanalResponse } from '../../interfaces/response/canalResponse.interface';
import { CanalRequest } from '../../interfaces/request/canalRequest.interface';
import Swal from 'sweetalert2';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Canal } from '../../models/canal.model';

@Injectable({
  providedIn: 'root'
})
export class CanalService {

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
  ) { }

  public obtenerCanalesActivos(pagina: string) {
    const url = URL_SERVICIOS + '/medium/findByStatus';

    const request: CanalRequest = {
      idUsuario: this.usuarioService.usuario.idUsuario,
      usuario: this.usuarioService.usuario.username,
      pagina,
      canal: new Canal(null, null, true)
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
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: CanalResponse) => {
        Swal.close();
        if (response.indicador === 'SUCCESS') {
          return response.canals;
        } else {

          Swal.fire({
            type: 'error',
            title: 'Ups!',
            text: 'En estos momentos no podemos obtener los canales, por favor intenta nuevamente.'
          });

          return [];
        }
      }),
      catchError(error => {
        Swal.close();
        Swal.fire({
          type: 'error',
          title: 'Ups!',
          text: 'En estos momentos no podemos obtener.'
        });
        return of([error]);
      })
    );
  }
}
