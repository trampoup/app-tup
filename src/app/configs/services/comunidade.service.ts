import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
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

  private obterBannerDataUrl(id: number): Observable<string | null> {
    return this.http
      .get(`${this.apiUrlLink}/${id}/banner`, { responseType: 'blob' })
      .pipe(
        map((blob) => {
          if (!blob || blob.size === 0) return null;
          const isImg = blob.type?.startsWith('image/');
          const typed = isImg ? blob : new Blob([blob], { type: 'image/jpeg' });

          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(typed);
          });
        }),
        // Converte a Promise<string|null> em Observable<string|null>
        switchMap((p) => (p ? (p as Promise<string>) : of(null))),
        catchError(() => of(null))
      );
  }

  private aplicarBanners(lista: ComunidadeResponseDTO[]): Observable<ComunidadeResponseDTO[]> {
    if (!lista?.length) return of([]);
    const tarefas = lista.map((c) => {
      if (!c.temBanner) return of(c);
      return this.obterBannerDataUrl(c.id).pipe(
        map((url) => ({ ...c, bannerUrl: url })),
        catchError(() => of({ ...c, bannerUrl: null as string | null }))
      );
    });
    return forkJoin(tarefas);
  }

  obterComunidadesComBanners(): Observable<ComunidadeResponseDTO[]> {
    return this.obterComunidades().pipe(
      switchMap((lista) => this.aplicarBanners(lista))
    );
  }

  obterComunidadesParticipando():Observable<ComunidadeResponseDTO[]>{
    return this.http.get<ComunidadeResponseDTO[]>(`${this.apiUrlLink}/minhas-comunidades-participando`);
  }

  obterComunidadesParticipandoComBanners(){
    return this.obterComunidadesParticipando().pipe(
      switchMap((lista) => this.aplicarBanners(lista))
    );
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
      )
      .pipe(
        switchMap((lista) => this.aplicarBanners(lista)),
        catchError(() => of([]))
      );
  }




}
