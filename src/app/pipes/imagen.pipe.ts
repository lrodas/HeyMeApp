import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/image/view/';


    if (!img) {
      url += 'xxx';
      return url;
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    url += img;

    return url;
  }

}
