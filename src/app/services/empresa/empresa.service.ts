import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario-service/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { EmpresaRequest } from 'src/app/interfaces/request/empresaRequest.interface';
import { Empresa } from 'src/app/models/empresa.model';
import { map, catchError } from 'rxjs/operators';
import { EmpresaResponse } from 'src/app/interfaces/response/empresaResponse.interface';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private subirArchivoService: SubirArchivoService
  ) { }

  public obtenerEmpresa(pagina: string) {
    const url = URL_SERVICIOS + '/company/findByUser';

    const request: EmpresaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    });
  }

  public guardarEmpresa(empresa: Empresa, pagina: string) {
    const url = URL_SERVICIOS + '/company/save';

    const request: EmpresaRequest = {
      usuario: this.usuarioService.usuario.username,
      idUsuario: this.usuarioService.usuario.idUsuario,
      pagina,
      empresa
    };

    return this.http.post(url, request, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.usuarioService.token)
    }).pipe(
      map((response: EmpresaResponse) => {
        if (response.codigo === '0000') {
          Swal.fire({
            type: 'success',
            title: 'Datos Actualizados',
            text: 'Los datos de su empresa han sido actualizados exitosamente'
          });
          return true;
        } else {
          Swal.fire({
            type: 'warning',
            title: 'No pudimos actualizar tus datos',
            text: response.descripcion + ''
          });
          return false;
        }
      }),
      catchError(error => {
        Swal.fire({
          type: 'warning',
          title: 'No pudimos actualizar tus datos',
          text: 'Actualmente tenemos problemas al actualizar los datos de tu empresa, por favor intenta mas tarde'
        });
        return of([error]);
      })
    );
  }

  public cambiarLogo(file: File, id: number) {

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor',
      showConfirmButton: false
    });

    Swal.showLoading();

    this.subirArchivoService.subirArchivo(file, 'empresa', id + '')
      .then( (resp: any) => {
        Swal.close();
        Swal.fire({
          type: 'success',
          title: 'Imagen actualizada exitosamente',
          text: ''
        });
      });
  }
}
