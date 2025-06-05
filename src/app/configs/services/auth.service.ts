import { Injectable } from '@angular/core';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //SOMENTE PARA FINS VISUAIS DA TELA DE CUPONS, POSTERIORMENTE COM O LOGIN SERÁ MODIFICADO.
  private tipoUsuarioAtual: TipoUsuario = TipoUsuario.ADMINISTRADOR;




  isAdministrador(): boolean {
    return this.tipoUsuarioAtual === TipoUsuario.ADMINISTRADOR;
  }

  isProfissional(): boolean {
    return this.tipoUsuarioAtual === TipoUsuario.PROFISSIONAL;
  }

  //Função para retornar ao inicio de acordo com a Role do usuário.

  getRotaInicial(): string {
    if (this.isAdministrador()) {
      return '/usuario/painel-principal-admin';
    } else if (this.isProfissional()) {
      return '/usuario/painel-principal-profissional';
    } else {
      return '/usuario/painel-principal-cliente';
    }
  }

  getRoleUsuario(): TipoUsuario {
    if (this.isAdministrador()) {
      return TipoUsuario.ADMINISTRADOR;
    } else if (this.isProfissional()) {
      return TipoUsuario.PROFISSIONAL;
    } else {
      return TipoUsuario.CLIENTE;
    }
  }

    constructor() { }
  }
