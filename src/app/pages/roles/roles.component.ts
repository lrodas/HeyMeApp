import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role/role.service';
import { Role } from '../../models/role.model';
import { RoleResponse } from '../../interfaces/response/roleResponse.interface';
import { Permiso } from '../../models/permiso.model';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  public roles: Role[];
  public permisos: Permiso;
  public page: number;

  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.obtenerRoles();
    this.cargarPermisos();
    this.page = 1;
  }

  public cambiarEstado(id: number, estado: boolean) {
    this.roleService.cambiarEstado('roles', id, estado)
      .subscribe( (response: Role) => {
        if (response) {
          const index: number = this.roles.findIndex(item => item.idRole === response.idRole);
          this.roles[index] = response;
        }
      });
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    this.permisos = permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Roles';
    })[0];
  }

  public obtenerRoles() {
    this.roleService.obtenerRoles('roles')
      .subscribe( (response: RoleResponse) => {
        this.roles = response.roles;
      });
  }

  public obtenerRolePorNombre(termino: string) {

    if (!termino) {
      return;
    }
    this.roleService.obtenerRolesPorNombre(termino, 'roles')
      .subscribe( (response: RoleResponse) => {
        this.roles = response.roles;
      });
  }
}
