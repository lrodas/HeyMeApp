import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { OpcionRequest } from '../../interfaces/request/opcionRequest.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpcionService {

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) { }

  public obtenerOpciones(pagina: string) {
    const url = URL_SERVICIOS + '/option/findAll';

    const request: OpcionRequest = {
      idUsuario: this.usuarioService.usuario.idUsuario,
      usuario: this.usuarioService.usuario.username,
      pagina
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }
}
