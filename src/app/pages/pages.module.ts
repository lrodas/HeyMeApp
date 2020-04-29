import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

// angular-calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Paginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PAGES_ROUTES } from './pages.routes';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { PreferenciasComponent } from './preferencias/preferencias.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { ProgramarComponent } from './programar/programar.component';
import { FormProgramarComponent } from './programar/form-programar.component';
import { ContactoComponent } from './contactos/contacto.component';
import { ContactosComponent } from './contactos/contactos.component'; // for FullCalendar!
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlantillasComponent } from './plantillas/plantillas.component';
import { PlantillaComponent } from './plantillas/plantilla.component';
import { BorradoresComponent } from './borradores/borradores.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { RoleComponent } from './role/role.component'; // <-- import the module
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

registerLocaleData(localeEs);

@NgModule({
    declarations: [
        DashboardComponent,
        PerfilComponent,
        PreferenciasComponent,
        NotificacionComponent,
        ProgramarComponent,
        FormProgramarComponent,
        ContactoComponent,
        ContactosComponent,
        PlantillasComponent,
        PlantillaComponent,
        BorradoresComponent,
        UsuariosComponent,
        RolesComponent,
        RoleComponent
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
        ReactiveFormsModule,
        NgxChartsModule,
        NgxPaginationModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory
        }),
        CKEditorModule
    ]
})
export class PagesModule {
    constructor() {
    }
}
