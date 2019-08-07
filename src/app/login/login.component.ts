import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario-service/usuario.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public cardClass = 'card-hidden';
  public email: string;
  public recuerdame: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {

    this.email = localStorage.getItem('email') || '';

    if (this.email.length > 1) {
      this.recuerdame = true;
    }

    setTimeout( () => {
      this.cardClass = '';
    }, 700 );
  }

  public iniciarSesion(form: NgForm) {

    console.log(form);
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

}
