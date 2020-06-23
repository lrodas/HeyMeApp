import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario-service/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { GrupoRequest } from '../../interfaces/request/grupoRequest.interface';
import { Grupo } from '../../models/grupo.model';
import { map, catchError } from 'rxjs/operators';
import { GrupoResponse } from 'src/app/interfaces/response/grupoResponse.interface';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) { }

  public obtenerGrupos(pagina: string) {
    const url = URL_SERVICIOS + '/group/findAll';

    const grupo: Grupo = new Grupo(null);
    const request: GrupoRequest = {
      idUsuario: this.usuarioService.usuario.idUsuario,
      usuario: this.usuarioService.usuario.username,
      pagina,
      grupo
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((grupoResponse: GrupoResponse) => {
        return grupoResponse.grupos;
      }),
      catchError(error => {
        Swal.fire({
          type: 'error',
          title: 'No pudimos obtener los grupos',
          text: `En estos momentos no fue posible obtener los grupos de contactos, por favor intenta mas tarde`,
          showConfirmButton: false,
          timer: 3000
        });
        return of([error]);
      })
    );
  }

  public obtenerGruposPorNombre(pagina: string, nombre: string) {
    const url = URL_SERVICIOS + '/group/findByName';

    const request: GrupoRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      grupo: new Grupo(null, nombre)
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map( (grupoResponse: GrupoResponse) => {
        return grupoResponse.grupos;
      }),
      catchError(error => {
        Swal.fire({
          type: 'error',
          title: 'No pudimos obtener los grupos',
          text: 'En estos momentos no fue posible obtener los grupos de contactos, por favor intenta mas tarde',
          showConfirmButton: false,
          timer: 3000
        });
        return of([error]);
      })
    );
  }
}
