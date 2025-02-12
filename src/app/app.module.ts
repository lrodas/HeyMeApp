// Rutas
import { APP_ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// Modulos
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from './shared/shared.module';
import { ModalPlantillasComponent } from './components/modal-plantillas/modal-plantillas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalNotificacionComponent } from './components/modal-notificacion/modal-notificacion.component';
import { RegistroComponent } from './login/registro.component';
import { ModalEmpresaComponent } from './components/modal-empresa/modal-empresa.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PagesComponent,
    ModalPlantillasComponent,
    ModalNotificacionComponent,
    RegistroComponent,
    ModalEmpresaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    APP_ROUTES,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    RecaptchaModule,  // this is the recaptcha main module
    RecaptchaFormsModule, // this is the module for form incase form validation
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
