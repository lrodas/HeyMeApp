import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role/role.service';
import { Role } from '../../models/role.model';
import { RoleResponse } from '../../interfaces/response/roleResponse.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  public roles: Role[];

  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.obtenerRoles();
  }

  public obtenerRoles() {
    this.roleService.obtenerRoles('roles')
      .subscribe( (response: RoleResponse) => {
        console.log(response);
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
