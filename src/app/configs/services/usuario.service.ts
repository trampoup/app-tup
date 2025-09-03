import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCadastroDTO } from 'src/app/cadastro/usuario-cadastro-dto';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './api-response-dto';
import { UsuarioSiteDTO } from 'src/app/sistema/mini-site/cadastrar-site/usuario-site-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrlLink = environment.apiURLBase + '/api/usuarios'; 

  constructor(private http:HttpClient) {}

  cadastrarUsuario(usuario: UsuarioCadastroDTO): Observable<ApiResponse<UsuarioCadastroDTO>> {
    return this.http.post<ApiResponse<UsuarioCadastroDTO>>(`${this.apiUrlLink}/cadastro`, usuario);
  }
  
  obterMeuSite(): Observable<UsuarioSiteDTO> {
    return this.http.get<UsuarioSiteDTO>(`${this.apiUrlLink}/meu-site`);
  }

  obterSitePorIdUsuario(id : number | string): Observable<UsuarioSiteDTO> {
    return this.http.get<UsuarioSiteDTO>(`${this.apiUrlLink}/site/${id}`);
  }

  atualizarMeuSite(dto: UsuarioSiteDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrlLink}/atualizar-meu-site`, dto);
  }

}
