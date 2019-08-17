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

const pagesRoutes: Routes = [
    { path: 'dashboard', canActivate: [ SesionGuard ], component: DashboardComponent, data: { titulo: 'Dashboard' } },
    { path: 'profile', canActivate: [ SesionGuard ], component: PerfilComponent, data: { titulo: 'Perfil' } },
    { path: 'settings', canActivate: [ SesionGuard ], component: PreferenciasComponent, data: { titulo: 'Preferencias' } },
    { path: 'notifications', canActivate: [ SesionGuard ], component: NotificacionComponent, data: { titulo: 'Notificaciones' } },
    { path: 'contact/:id', canActivate: [ SesionGuard ], component: ContactoComponent, data: { titulo: 'Administrar Contacto' } },
    { path: 'schedule', canActivate: [ SesionGuard ], component: ProgramarComponent, data: { titulo: 'Notificaciones' } },
    { path: 'contacts', canActivate: [ SesionGuard ], component: ContactosComponent, data: { titulo: 'Contactos' } },
    {
        path: 'scheduleForm/:date',
        canActivate: [ SesionGuard ],
        component: FormProgramarComponent,
        data: {
            titulo: 'Formulario de Notificaciones'
        }
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
