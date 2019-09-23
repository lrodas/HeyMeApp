import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PreferenciasComponent } from './preferencias/preferencias.component';
import { SesionGuard } from '../services/guards/sesion.guard';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { ProgramarComponent } from './programar/programar.component';
import { FormProgramarComponent } from './programar/form-programar.component';
import { ContactoComponent } from './contactos/contacto.component';
import { ContactosComponent } from './contactos/contactos.component';
import { PlantillasComponent } from './plantillas/plantillas.component';
import { PlantillaComponent } from './plantillas/plantilla.component';
import { BorradoresComponent } from './borradores/borradores.component';
import { LoginGuard } from '../services/guards/login.guard';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { RoleComponent } from './role/role.component';

const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        canActivate: [ LoginGuard, SesionGuard ],
        component: DashboardComponent,
        data: { titulo: 'Dashboard' }
    },
    { path: 'profile', canActivate: [ LoginGuard, SesionGuard ], component: PerfilComponent, data: { titulo: 'Perfil' } },
    { path: 'settings', canActivate: [ LoginGuard, SesionGuard ], component: PreferenciasComponent, data: { titulo: 'Preferencias' } },
    {
        path: 'notifications',
        canActivate: [ LoginGuard, SesionGuard ],
        component: NotificacionComponent,
        data: { titulo: 'Notificaciones' }
    },
    {
        path: 'contact/:id',
        canActivate: [ LoginGuard, SesionGuard ],
        component: ContactoComponent,
        data: { titulo: 'Administrar Contacto' }
    },
    {
        path: 'schedule',
        canActivate: [ LoginGuard, SesionGuard ],
        component: ProgramarComponent,
        data: {
            titulo: 'Notificaciones'
        }
    },
    {
        path: 'contacts',
        canActivate: [ LoginGuard, SesionGuard ],
        component: ContactosComponent,
        data: {
            titulo: 'Contactos'
        }
    },
    {
        path: 'scheduleForm/:date',
        canActivate: [ LoginGuard, SesionGuard ],
        component: FormProgramarComponent,
        data: {
            titulo: 'Formulario de Notificaciones'
        }
    },
    {
        path: 'templates',
        canActivate: [ LoginGuard, SesionGuard ],
        component: PlantillasComponent,
        data: { titulo: 'Plantillas de notificaciones' }
    },
    {
        path: 'template/:id',
        canActivate: [ LoginGuard, SesionGuard ],
        component: PlantillaComponent,
        data: { titulo: 'Plantilla de notificacion' }
    },
    {
        path: 'drafts',
        canActivate: [ LoginGuard, SesionGuard ],
        component: BorradoresComponent,
        data: { titulo: 'Borradores de notificaciones' }
    },
    {
        path: 'users',
        canActivate: [ LoginGuard, SesionGuard ],
        component: UsuariosComponent,
        data: { titulo: 'Administracion de usuarios' }
    },
    {
        path: 'roles',
        canActivate: [ LoginGuard, SesionGuard ],
        component: RolesComponent,
        data: { titulo: 'Administracion de roles' }
    },
    {
        path: 'role/:id',
        canActivate: [ LoginGuard, SesionGuard ],
        component: RoleComponent,
        data: { titulo: 'Mantenimiento de roles' }
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
