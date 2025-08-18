import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cupom } from 'src/app/sistema/cupons/cupom';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './api-response-dto';

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

  resgatarCupom(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrlLink}/${id}/resgatar`, null);
  }

  getMeusCuponsResgatados(): Observable<Cupom[]> {
    return this.http.get<Cupom[]>(`${this.apiUrlLink}/meus-cupons-resgatados`);
  }

  deletarCupom(id:number | string): Observable<{message:string}> {
    return this.http.delete<{message:string}>(`${this.apiUrlLink}/${id}`);
  }

  obterCupomPorId(id: number | string): Observable<Cupom> {
    return this.http
      .get<ApiResponse<Cupom>>(`${this.apiUrlLink}/${id}`)
      .pipe(
        map(res => res.response),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) return throwError(() => new Error('Cupom não encontrado.'));
          if (err.status === 401) return throwError(() => new Error('Não autenticado.'));
          return throwError(() => err);
        })
      );
  }

}
