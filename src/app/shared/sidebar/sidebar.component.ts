import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { USUARIO_STORAGE, PERMISOS } from '../../config/config';
import { Permiso } from '../../models/permiso.model';
import { SharedService } from '../../services/shared/shared.service';
import { PermisoResponse } from '../../interfaces/response/permisoResponse.interface';

declare function init_plugin();

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;
  public permisos: Permiso[];
  public menus: {
    icono: string,
    nombre: string,
    evento: boolean,
    orden: string,
    url?: string,
    subMenu?: {
      icono: string,
      url: string,
      evento: boolean,
      nombre: string
    }[]
  }[];

  constructor(
    private usuarioService: UsuarioService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    init_plugin();

    this.usuario = JSON.parse(localStorage.getItem(USUARIO_STORAGE));
    this.obtenerPermisos();
  }

  public logout() {
    this.usuarioService.logout();
  }

  private obtenerPermisos() {
    this.menus = new Array();
    this.sharedService.obtenerPermisos(this.usuario.role.idRole, 'Sidebar')
      .subscribe( (response: PermisoResponse) => {
        if (response.indicador === 'SUCCESS') {

          for (const permiso of response.permisos) {
            if (permiso.opcion.orden.length === 1) {
              this.menus.push(
                {
                  icono: permiso.opcion.icono,
                  nombre: permiso.opcion.descripcion,
                  evento: permiso.opcion.evento,
                  orden: permiso.opcion.orden,
                  url: permiso.opcion.url
                }
              );
            } else {
              const idMenu = permiso.opcion.orden.substr(0, 1);
              const menuList = this.menus.find((menu) => {
                return menu.orden === idMenu;
              });
              if (!menuList.subMenu) {
                menuList.subMenu = new Array();
              }

              menuList.subMenu.push(
                {
                  icono: permiso.opcion.icono,
                  url: permiso.opcion.url,
                  evento: permiso.opcion.evento,
                  nombre: permiso.opcion.descripcion
                }
              );
            }
          }
          localStorage.setItem(PERMISOS, JSON.stringify(response.permisos));
        }
      });
  }

}
