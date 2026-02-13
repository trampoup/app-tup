import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    formData.append('servico', new Blob([JSON.stringify(servico)], { type: 'application/json' }));

    if(banner) formData.append('banner',banner, banner.name);

    return this.http.post(this.apiURL,formData);
  }

  atualizar(servico: Servico, banner?: File | null) {
    const formData = new FormData();
    formData.append('servico', new Blob([JSON.stringify(servico)], { type: 'application/json' }));
    if (banner) formData.append('banner', banner, banner.name);

    return this.http.put<Servico>(`${this.apiURL}/${servico.id}`, formData);
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

  obterBannerUrl(id: number) {
    return this.http.get<{ url: string }>(`${this.apiURL}/${id}/banner`);
  }

}
