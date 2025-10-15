import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Servico } from 'src/app/sistema/servicos/Servico';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  apiURL: string = environment.apiURLBase + '/api/servicos';

  constructor(private http: HttpClient) { }

  cadastrar(servico:Servico, banner?: File | null){
    const formData = new FormData();
    const servicoJson = new Blob(
      [JSON.stringify(servico)], {type:'application/json'}
    );
    formData.append('servico',servicoJson);

    if(banner) formData.append('banner',banner, banner.name);

    return this.http.post(this.apiURL,formData);
  }

  atualizar(servico:Servico){
    return this.http.put(this.apiURL,servico);
  }

  obterTodos(){
    return this.http.get<Servico[]>(this.apiURL);
  }

  obterMeusServicos(){
    return this.http.get<Servico[]>(`${this.apiURL}/meus-servicos`);
  }

  obterServicosPorProfissional(id:number | string){
    return this.http.get<Servico[]>(`${this.apiURL}/servicos-do-profissional/${id}`);
  }

  obterPorId(id:number | string){
    return this.http.get<Servico>(`${this.apiURL}/${id}`);
  }

  deletar(id:number | string){
    return this.http.delete(`${this.apiURL}/${id}`);
  }


  //BANNER
 private obterBannerDataUrl(id: number): Observable<string | null> {
    return this.http
      .get(`${this.apiURL}/${id}/banner`, {
        responseType: 'blob',
        // use isto se você autentica por cookie/sessão cross-site:
        // withCredentials: true,
      })
      .pipe(
        map((blob) => {
          if (!blob || blob.size === 0) return null;
          const typed = blob.type?.startsWith('image/')
            ? blob
            : new Blob([blob], { type: 'image/jpeg' });
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(typed);
          });
        }),
        switchMap((p) => (p ? (p as Promise<string>) : of(null))),
        catchError(() => of(null))
      );
  }

  obterMeusServicosComBanners(): Observable<Servico[]> {
    return this.obterMeusServicos().pipe(
      switchMap((lista) => {
        if (!lista?.length) return of([]);
        const tarefas = lista.map((s) =>
          this.obterBannerDataUrl(s.id!).pipe(
            map((url) => ({ ...s, bannerUrl: url })),
            catchError(() => of({ ...s, bannerUrl: null as string | null }))
          )
        );
        return forkJoin(tarefas);
      })
    );
  }

  obterServicosPorProfissionalComBanners(id: number | string): Observable<Servico[]> {
    return this.obterServicosPorProfissional(id).pipe(
      switchMap((lista) => {
        if (!lista?.length) return of([]);
        const tarefas = lista.map((s) =>
          this.obterBannerDataUrl(s.id!).pipe(
            map((url) => ({ ...s, bannerUrl: url })),
            catchError(() => of({ ...s, bannerUrl: null as string | null }))
          )
        );
        return forkJoin(tarefas);
      })
    );
  }

}
