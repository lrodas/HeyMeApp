import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { PlantillaRequest } from '../../interfaces/request/plantillaRequest.interface';
import { Plantilla } from '../../models/plantilla.model';

import Swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';
import { ContactoResponse } from '../../interfaces/response/contactoResponse.interface';
import { of } from 'rxjs';
import { PlantillaResponse } from '../../interfaces/response/plantillaResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class PlantillasService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  public obtenerPlantillasPorEstado(estado: boolean, pagina: string) {

    const url = URL_SERVICIOS + '/template/findByStatus';

    const plantillaRequest: PlantillaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      plantilla: new Plantilla(null, '', '', estado)
    };

    return this.http.post(url, plantillaRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerPlantillas() {

    const url = URL_SERVICIOS + '/template/findAll';

    return this.http.post(url, {}, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerPlantilla(idPlantilla: number, pagina: string) {

    const url = URL_SERVICIOS + '/template/findById';

    const plantillaRequest: PlantillaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      plantilla: new Plantilla(idPlantilla)
    };

    return this.http.post(url, plantillaRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public obtenerPlantillaPorTitulo(termino: string, pagina: string) {

    const url = URL_SERVICIOS + '/template/findByTitle';

    const plantillaRequest: PlantillaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      plantilla: new Plantilla(null, termino)
    };

    return this.http.post(url, plantillaRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public guardarPlantilla(plantilla: Plantilla, pagina: string) {

    const url = URL_SERVICIOS + '/template/save';

    const plantillaRequest: PlantillaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      plantilla
    };

    return this.http.post(url, plantillaRequest, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: PlantillaResponse) => {

        if (response.indicador === 'SUCCESS') {
            Swal.fire({
              type: 'success',
              title: 'Plantilla guardada exitosamente',
              text: `La plantilla ${plantilla.titulo} fue guardada con exito`,
              showConfirmButton: false,
              timer: 3000
            });
            return response.plantilla;
        } else {
          Swal.fire({
            type: 'error',
            title: 'No pudimos guardar la plantilla',
            text: `En estos momentos no fue posible guardar la plantilla: ${ plantilla.titulo }, por favor intenta mas tarde`,
            showConfirmButton: false,
            timer: 3000
          });
          return false;
        }

      }),
      catchError( error => {
        Swal.fire({
          type: 'error',
          title: 'No pudimos guardar la plantilla',
          text: `En estos momentos no fue posible guardar la plantilla: ${ plantilla.titulo }, por favor intenta mas tarde`,
          showConfirmButton: false,
          timer: 3000
        });
        return of(error);
      })
    );
  }
}
