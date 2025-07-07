import { Component, OnInit } from '@angular/core';
import { TipoUsuario } from '../login/tipo-usuario.enum';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  step:number = 0; //variavel para mudar as telas
  roleUsuario = TipoUsuario;
  //variavel para ajudar a saber e mostrar a tela de cadastro de acordo com a role.
  selectedRole : TipoUsuario | null = null; 

  constructor() { }

  ngOnInit(): void {
  }

  selectRole(role: TipoUsuario) {
    this.selectedRole = role;
  }

  next(){
    this.step++;
  }

}
