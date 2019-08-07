import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { RegionRequest } from '../../interfaces/request/regionRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  public obtenerRegiones(pagina: string) {
    const url = URL_SERVICIOS + '/region/retrieveRegion';

    const request: RegionRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }
}
