import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { ProvinciaRequest } from '../../interfaces/request/provinciaRequest.interface';
import { Provincia } from '../../models/provincia.model';
import { Region } from '../../models/region.model';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  public obtenerProvinciaPorRegion(idRegion: number, pagina: string) {

    const url = URL_SERVICIOS + '/province/retrieveProvinceByRegion';

    const provinciaRequest: ProvinciaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      provincia: new Provincia(null, '', new Region(idRegion, '', null))
    };

    return this.http.post(url, provinciaRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }
}
