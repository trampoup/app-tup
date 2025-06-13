import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { Usuario } from 'src/app/login/usuario';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenURL: string = environment.apiURLBase + environment.obterTokenUrl
  clientID: string = environment.clientId;
  clientSecret: string = environment.clientSecret;



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
      return '/usuario/inicio-admin';
    } else if (this.isProfissional()) {
      return '/usuario/inicio-profissinal';
    } else {
      return '/usuario/inicio-cliente';
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

  getRotaDashboard(): string {
    if (this.isAdministrador()) {
      return '/usuario/painel-principal-admin';
    } else if (this.isProfissional()) {
      return '/usuario/painel-principal-profissinal';
    } else {
      return '/usuario/painel-principal-cliente';
    }
  }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username) // email
      .set('password', password) // senha
      .set('grant_type', 'password')

    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientID}: ${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    return this.http.post(this.tokenURL, params.toString(), { headers });
  }

  obterPerfilUsuario(): Observable<Usuario> {
    const fakeUser: Usuario = {
      id: 1,
      nome: 'Alex',
      tipoUsuario: this.tipoUsuarioAtual
    };
    return of(fakeUser);
  }


  constructor(private http: HttpClient) { }
}
