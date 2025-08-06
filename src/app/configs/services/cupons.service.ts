import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cupom } from 'src/app/sistema/cupons/cupom';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuponsService {
  apiUrlLink = environment.apiURLBase + "/api/cupons";
  
  constructor(
    private http:HttpClient
  ) { }
  
  cadastrarCupom(cupom:Cupom){
    return this.http.post(this.apiUrlLink,cupom);
  }

  atualizarCupom(cupomId: string, cupom: Cupom) {
    return this.http.put<Cupom>(`${this.apiUrlLink}/${cupomId}`, cupom);
  }

  getTodosCupons():Observable<Cupom[]>{
    return this.http.get<Cupom[]>(this.apiUrlLink);
  }

  getMeusCuponsCadastrados():Observable<Cupom[]>{
    return this.http.get<Cupom[]>(this.apiUrlLink + "/meus-cupons-cadastrados");
  }
}
