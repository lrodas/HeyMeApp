import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { UsuarioService } from '../services/usuario-service/usuario.service';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  constructor(
    private usuarioService: UsuarioService
  ) {}

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/image/view/';


    if (!img) {
      if (tipo == 'usuario') {
        url += 'usuario-' + this.usuarioService.usuario.idUsuario + '-xxx';
      } else {
        url += 'empresa-' + this.usuarioService.usuario.empresa.idEmpresa + '-xxx';
      }
      return url;
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    if (tipo == 'usuario') {
      url += 'usuario-' + img;
    } else {
      url += 'empresa-' + img;
    }
    return url;
  }

}
