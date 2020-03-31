import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Role } from '../models/role.model';
import { Genero } from '../models/genero.model';
import { Empresa } from '../models/empresa.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public usuario: Usuario;
  
  constructor() { }

  ngOnInit() {
    this.usuario = new Usuario(null, '', '', '', null, new Role(), '', '', '', new Genero(), null, new Empresa());
  }

  public guardar(form: NgForm) {

    if (form.invalid) {
      console.log('error');
      return;
    }

    console.log(this.usuario);
  }

}
