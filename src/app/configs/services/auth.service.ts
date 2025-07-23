import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginDTO } from 'src/app/login/LoginDTO';
import { catchError, map, tap, throwError } from 'rxjs';
import { UsuarioPerfil } from 'src/app/sistema/Dashboards/usuario-perfil';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiURLBase + "/api/usuarios";
  tokenUrl: string = environment.apiURLBase + environment.obterTokenUrl;
  clientId: string = environment.clientId;
  clientSecret: string = environment.clientSecret;

  private UsuarioPerfil: UsuarioPerfil | null = null;
  private tipoUsuarioAtual: TipoUsuario | null = null;


  constructor(private http: HttpClient) {}

  isAdministrador(): boolean {
    return this.tipoUsuarioAtual === TipoUsuario.ADMIN;
  }

  isProfissional(): boolean {
    return this.tipoUsuarioAtual === TipoUsuario.PROFISSIONAL;
  }

  setRoleUsuario(tipoUsuario: TipoUsuario): void {
    this.tipoUsuarioAtual = tipoUsuario;
  }

  //Função para retornar ao inicio de acordo com a Role do usuário.

  getRotaInicial(): string {
    if (this.isAdministrador()) {
      return '/usuario/inicio-admin';
    } else if (this.isProfissional()) {
      return '/usuario/inicio-profissional';
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
      return '/usuario/painel-principal-profissional';
    } else {
      return '/usuario/painel-principal-cliente';
    }
  }


  login(loginDTO: LoginDTO) : Observable<any> {  const params = new HttpParams()
                        .set('username', loginDTO.email)
                        .set('password', loginDTO.senha)
                        .set('grant_type', 'password')


    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    return this.http.post<any>(this.tokenUrl, params.toString(), { headers })
      .pipe(tap(res => {
        localStorage.setItem('access_token', res.access_token);
      }));
  }
  
  encerrarSessao(){
    localStorage.removeItem('access_token')
  }


  obterPerfilUsuario(): Observable<UsuarioPerfil> {
    const token = localStorage.getItem('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<UsuarioPerfil>(`${this.apiUrl}/token`, { headers }).pipe(
      map(dto => ({
        idUsuario: dto.idUsuario,
        nome:      dto.nome,
        email:     dto.email,
        tipoUsuario: dto.tipoUsuario as TipoUsuario
      })),
      tap(u => {
        // converte a string que veio do back para o enum
        this.tipoUsuarioAtual = u.tipoUsuario;
        this.UsuarioPerfil = u;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter perfil do usuário:', error);
        return throwError(
          'Erro ao obter perfil do usuário. Por favor, tente novamente.'
        );
      })
    );
  }

}
