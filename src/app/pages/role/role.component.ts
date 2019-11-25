import { Component, OnInit } from '@angular/core';
import { OpcionService } from '../../services/opcion/opcion.service';
import { Opcion } from '../../models/opcion.model';
import { OpcionResponse } from '../../interfaces/response/opcionResponse.interface';
import { Role } from '../../models/role.model';
import { Permiso } from 'src/app/models/permiso.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../services/role/role.service';
import { RoleResponse } from '../../interfaces/response/roleResponse.interface';
import { NgForm } from '@angular/forms';
import { PERMISOS } from '../../config/config';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  public permisos: Permiso[];
  public role: Role;

  constructor(
    private opcionService: OpcionService,
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.role = new Role(null, '', '', false, []);
    this.obtenerOpciones();

    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];

      if (id !== 'new' && this.cargarPermisos().cambio) {
        this.obtenerRolePorId(id);
      } else if (id === 'new' && !this.cargarPermisos().alta) {
        this.router.navigate(['/roles']);
      } else if (id !== 'new' && !this.cargarPermisos().cambio) {
        this.router.navigate(['/roles']);
      }
    });
  }

  public cargarPermisos() {
    const permisos: Permiso[] = JSON.parse(localStorage.getItem(PERMISOS));
    return permisos.filter( (permiso: Permiso) => {
      return permiso.opcion.descripcion === 'Roles';
    })[0];
  }

  public guardarRole(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this.role.permisos = this.permisos;

    this.roleService.guardarRole(this.role, 'Role')
      .subscribe( (response: RoleResponse) => {
          if (response.indicador === 'SUCCESS') {
              this.router.navigate(['/role', response.role.idRole]);
          }
      });
  }

  public obtenerOpciones() {
    this.opcionService.obtenerOpciones('role form')
      .subscribe( (response: OpcionResponse) => {
        response.opciones.forEach( opcionDB => {
          if (!this.permisos) {
            this.permisos = new Array();
          }
          this.permisos.push(new Permiso(null, opcionDB, new Role(), false, false, false, false));
        });
      });
  }

  public obtenerRolePorId(idRole: number) {

    this.roleService.obtenerRolePorId(idRole, 'Role')
      .subscribe( (response: RoleResponse) => {
        if (response.indicador === 'SUCCESS') {
          if (this.permisos) {
            this.permisos.forEach( permiso => {
              const idOpcion = permiso.opcion.idOpcion;
              const permisoFiltrado = response.role.permisos.find( permisoDB => {
                return permisoDB.opcion.idOpcion === idOpcion;
              });

              if (permisoFiltrado) {
                permiso.alta = permisoFiltrado.alta;
                permiso.baja = permisoFiltrado.baja;
                permiso.cambio = permisoFiltrado.cambio;
                permiso.imprimir = permisoFiltrado.imprimir;
                permiso.idPermiso = permisoFiltrado.idPermiso;
              }
            });
            this.role = response.role;
          }
        } else {
          this.router.navigate(['/roles']);  
        }
      }, error => {
        console.log(error);
        this.router.navigate(['/roles']);
      });
  }

}
