import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { Usuario } from 'src/app/login/usuario';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginDTO } from 'src/app/login/LoginDTO';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiURLBase + "/api/usuarios";
  tokenUrl: string = environment.apiURLBase + environment.obterTokenUrl;
  clientId: string = environment.clientId;
  clientSecret: string = environment.clientSecret;

  //SOMENTE PARA FINS VISUAIS DA TELA DE CUPONS, POSTERIORMENTE COM O LOGIN SERÁ MODIFICADO.
  private tipoUsuarioAtual: TipoUsuario = TipoUsuario.ADMIN;


  constructor(private http: HttpClient) {}

  isAdministrador(): boolean {
    return this.tipoUsuarioAtual === TipoUsuario.ADMIN;
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
      return TipoUsuario.ADMIN;
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

  obterPerfilUsuario(): Observable<Usuario> {
    const fakeUser: Usuario = {
      id: 1,
      nome: 'Alex',
      tipoUsuario: this.tipoUsuarioAtual
    };
    return of(fakeUser);
  }

  login(loginDTO: LoginDTO) : Observable<any> {  const params = new HttpParams()
                        .set('username', loginDTO.email)
                        .set('password', loginDTO.senha)
                        .set('grant_type', 'password')


    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    return this.http.post( this.tokenUrl, params.toString(), { headers });
  }
  
  encerrarSessao(){
    localStorage.removeItem('access_token')
  }


}
