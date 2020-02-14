import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuard } from './services/guards/login.guard';
import { RegistroComponent } from './login/registro.component';

const APP_ROUTE: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistroComponent},
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuard],
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    { path: '**', component: PageNotFoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot(APP_ROUTE, { useHash: true });
