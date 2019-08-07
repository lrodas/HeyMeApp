import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [
        SidebarComponent,
        PageNotFoundComponent,
        HeaderComponent,
        FooterComponent
    ],
    exports: [
        SidebarComponent,
        PageNotFoundComponent,
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        RouterModule,
        SweetAlert2Module,
        PipesModule,
    ]
})
export class SharedModule { }
