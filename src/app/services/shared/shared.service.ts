import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { PermisoRequest } from '../../interfaces/request/permisoRequest.interface';
import { UsuarioService } from '../usuario-service/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) { }

  public obtenerPermisos(idRole: number, pagina: string) {

    const url = URL_SERVICIOS + '/permission/retrievePermissionsByRole';

    const permisoRequest: PermisoRequest  = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      idRole
    };

    return this.http.post(url, permisoRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }
}
