import { Router, ActivationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { UsuarioService } from '../../services/usuario-service/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public titulo: string;

  constructor(
    private router: Router,
    private title: Title,
    private usuarioService: UsuarioService
  ) {

    this.getDataRoute()
      .subscribe( data => {
        this.titulo = data.titulo;
        this.title.setTitle(this.titulo);
      });
  }

  ngOnInit() {
  }

  private getDataRoute() {
    return this.router.events
      .pipe(
        filter( evento => evento instanceof ActivationEnd ),
        filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null),
        map( (evento: ActivationEnd) => evento.snapshot.data )
      );
  }

  public logout() {
    this.usuarioService.logout();
  }

}
