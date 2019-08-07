import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { USUARIO_STORAGE } from '../../config/config';

declare function init_plugin();

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    init_plugin();

    this.usuario = JSON.parse(localStorage.getItem(USUARIO_STORAGE));
  }

  public logout() {
    this.usuarioService.logout();
  }

}
