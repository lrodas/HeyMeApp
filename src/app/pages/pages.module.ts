import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

// Paginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PAGES_ROUTES } from './pages.routes';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { PreferenciasComponent } from './preferencias/preferencias.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { ProgramarComponent } from './programar/programar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormProgramarComponent } from './programar/form-programar.component';
import { ContactoComponent } from './contactos/contacto.component'; // for FullCalendar!

@NgModule({
    declarations: [
        DashboardComponent,
        PerfilComponent,
        PreferenciasComponent,
        NotificacionComponent,
        ProgramarComponent,
        FormProgramarComponent,
        ContactoComponent
    ],
    exports: [
        DashboardComponent,
        PerfilComponent
    ],
    imports: [
        FormsModule,
        SharedModule,
        RouterModule,
        CommonModule,
        PipesModule,
        PAGES_ROUTES,
        FullCalendarModule // for FullCalendar!
    ]
})
export class PagesModule {
    constructor() {
    }
}
