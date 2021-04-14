import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario-service/usuario.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public cardClass = 'card-hidden';
  public email: string;
  public password: string;
  public recuerdame: boolean;
  public inputType: string;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.inputType = 'password';

    this.activatedRoute.queryParamMap.subscribe(parametros => {
      const id = parametros.get('id');
      if (id) {
          this.usuarioService.activarUsuario(id, 'login')
            .subscribe();
      }
    });

    this.email = localStorage.getItem('email') || '';

    if (this.email.length > 1) {
      this.recuerdame = true;
    }

    setTimeout( () => {
      this.cardClass = '';
    }, 700 );
  }

  public showPassword() {
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  public iniciarSesion(form: NgForm) {

    const password = form.value.password;

    if (form.invalid) {
      return;
    }

    this.usuarioService.login(this.email, password, this.recuerdame)
      .subscribe( result => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        Swal.fire({
          title: 'Error al iniciar sesion',
          text: 'Usurio o contraseña incorrectos',
          type: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }

  private convertMS( milliseconds ) {
    let day: number;
    let hour: number;
    let minute: number;
    let seconds: number;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day,
        hour,
        minute,
        seconds
    };
  }
}
