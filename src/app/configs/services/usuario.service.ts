import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UsuarioCadastroDTO } from 'src/app/cadastro/usuario-cadastro-dto';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './api-response-dto';
import { UsuarioSiteDTO } from 'src/app/sistema/mini-site/cadastrar-site/usuario-site-dto';
import { UsuarioDadosDTO } from 'src/app/sistema/cupons/UsuarioDadosDTO';
import { UsuarioAtualizacaoDTO } from 'src/app/sistema/meu-perfil/UsuarioAtualizarDTO';
import { Setor } from 'src/app/cadastro/categorias-enum';
import { InicioProfissionalResumoDTO } from 'src/app/sistema/inicios/inicio-profissional/InicioProfissionalResumoDTO';
import { AdminDashboardCardsDTO } from 'src/app/sistema/Dashboards/painel-admin/AdminDashboardCardsDTO';
import { AdminNovoUsuarioDTO, AdminCrescimentoMensalDTO, AdminUsuariosPorEstadoDTO } from 'src/app/sistema/Dashboards/painel-admin/painel-admin.component';


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

  obterTodosProfissionais(){
    return this.http.get<UsuarioSiteDTO[]>(`${this.apiUrlLink}/obter-todos-profissionais`);
  }

  atualizarDadosPessoais(dto: UsuarioAtualizacaoDTO) {
    return this.http.put<void>(`${this.apiUrlLink}/atualizar-dados-pessoais`, dto);
  }

  alterarSenha(payload: { senhaAtual: string; novaSenha: string }) {
    return this.http.put<void>(`${this.apiUrlLink}/alterar-senha`, payload);
  }

  atualizarInteresses(interesses: Setor[]): Observable<any> {
    return this.http.put(`${this.apiUrlLink}/interesses`, interesses);
  }

  obterProfissionaisPorInteresses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlLink}/profissionais-por-interesses`);
  }

  favoritarProfissional(idProfissional: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrlLink}/favoritos/${idProfissional}`, {});
  }

  desfavoritarProfissional(idProfissional: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlLink}/favoritos/${idProfissional}`);
  }

  obterFavoritos(): Observable<UsuarioDadosDTO[]> {
    return this.http.get<UsuarioDadosDTO[]>(`${this.apiUrlLink}/favoritos`);
  }

  verificarSeEhFavorito(idProfissional: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrlLink}/favoritos/${idProfissional}/verificar`);
  }

  enviarEmailSuporte(mensagem: string): Observable<any> {
    const url = `${this.apiUrlLink}/email/suporte`;
    const requestDTO = { mensagem };
    return this.http.post<any>(url, requestDTO).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao enviar e-mail para o suporte.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  obterResumoInicioProfissional() {
    return this.http.get<InicioProfissionalResumoDTO>(`${this.apiUrlLink}/inicio-profissional/resumo`);
  }

  obterCardsInicioAdmin() {
    return this.http.get<AdminDashboardCardsDTO>(`${this.apiUrlLink}/estatisticas/cards-painel-admin`);
  }

  obterNovosUsuariosAdmin() {
    return this.http.get<AdminNovoUsuarioDTO[]>(`${this.apiUrlLink}/estatisticas/novos-usuarios`);
  }

  obterCrescimentoMensalUsuarios(ano?: number) {
    const url = ano
      ? `${this.apiUrlLink}/estatisticas/crescimento-mensal-usuarios?ano=${ano}`
      : `${this.apiUrlLink}/estatisticas/crescimento-mensal-usuarios`;
    return this.http.get<AdminCrescimentoMensalDTO>(url);
  }

  obterUsuariosPorEstadoAdmin() {
    return this.http.get<AdminUsuariosPorEstadoDTO>(
      `${this.apiUrlLink}/estatisticas/usuarios-por-estado`
    );
  }




}
