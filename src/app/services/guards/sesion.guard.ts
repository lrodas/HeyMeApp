import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario-service/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SesionGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService
  ) {}

  canActivate(): boolean | Promise<boolean> {

      const token = this.usuarioService.token;
      const payload = JSON.parse( atob(token.split('.')[1]));
      const expirado = this.expirado(payload.exp);

      return !expirado;
  }

  expirado( fechaExp: number ) {
    const ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }

}
