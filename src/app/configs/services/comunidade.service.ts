import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Setor } from 'src/app/cadastro/categorias-enum';
import { ComunidadeCadastroDTO } from 'src/app/sistema/comunidades/ComunidadeCadastroDTO';
import { ComunidadeResponseDTO } from 'src/app/sistema/comunidades/ComunidadeResponseDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadeService {
  apiUrlLink = environment.apiURLBase + "/api/comunidades";

  constructor(
    private http:HttpClient
  ) { }

  cadastrarComunidade(payload: FormData){
    return this.http.post(this.apiUrlLink,payload);
  }

  obterComunidades():Observable<ComunidadeResponseDTO[]>{
    return this.http.get<ComunidadeResponseDTO[]>(`${this.apiUrlLink}/obter-todas-comunidades`);
  }

  obterComunidadePorId(id:number | string):Observable<ComunidadeResponseDTO>{
    return this.http.get<ComunidadeResponseDTO>(`${this.apiUrlLink}/${id}`);
  }

  obterComunidadesParticipando():Observable<ComunidadeResponseDTO[]>{
    return this.http.get<ComunidadeResponseDTO[]>(`${this.apiUrlLink}/minhas-comunidades-participando`);
  }

  obterComunidadesCriadas():Observable<ComunidadeResponseDTO[]>{
    return this.http.get<ComunidadeResponseDTO[]>(`${this.apiUrlLink}/minhas-comunidades-criadas`);
  }

  participarDaComunidade(id: number | string) {
    return this.http.post(`${this.apiUrlLink}/participar-da-comunidade/${id}`, null);
  }

  sairDaComunidade(id: number | string) {
    return this.http.delete(`${this.apiUrlLink}/sair-da-comunidade/${id}`);
  }


  filtrarComunidadesPorSetor(setor: Setor): Observable<ComunidadeResponseDTO[]> {
    return this.http
      .get<ComunidadeResponseDTO[]>(
        `${this.apiUrlLink}/minhas-comunidades-participando/por-setor`,
        { params: { setor } }
      );
  }

  deletarComunidade(id: number | string) {
    return this.http.delete(`${this.apiUrlLink}`, { params: { id: String(id) } });
  }


  editarComunidade(id: number | string, formData: FormData, removeBanner = false) {
    return this.http.put<ComunidadeResponseDTO>(
      `${this.apiUrlLink}/${id}?removeBanner=${removeBanner}`,
      formData
    );
  }

  buscarComunidadesPorNome(nome: string) {
    const termo = encodeURIComponent((nome ?? '').trim());
    if (!termo) return of([] as ComunidadeResponseDTO[]);

    return this.http
      .get<ComunidadeResponseDTO[]>(`${this.apiUrlLink}/search/${termo}`)
      .pipe(
        map((lista) => (lista ?? [])),
        catchError(() => of([]))
      );
  }
}
