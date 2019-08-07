import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario-service/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(
    private http: HttpClient,
    private usuario: UsuarioService
  ) { }

  public guardarNotificacion() {
    
  }
}
