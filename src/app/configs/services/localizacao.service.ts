import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Localizacao } from 'src/app/sistema/localizacao/localizacao';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {
  apiUrlLink = environment.apiURLBase + "/api/localizacao";

  constructor(
    private http:HttpClient
  ) { }

  cadaastrarLocalizacao(localizacao:Localizacao){
    return this.http.post(this.apiUrlLink,localizacao);
  }

  obterPorId(id: number | string){
    return this.http.get<Localizacao>(`${this.apiUrlLink}/${id}`);
  }

  obterLocalizacoesLogado(){
    return this.http.get<Localizacao[]>(this.apiUrlLink + "/minhas-localizacoes");
  }

  atualizar(id: number|string, localizacao: Localizacao) {
    return this.http.put<Localizacao>(`${this.apiUrlLink}/${id}`, localizacao);
  }

}
