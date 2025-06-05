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

  constructor() { }
}
