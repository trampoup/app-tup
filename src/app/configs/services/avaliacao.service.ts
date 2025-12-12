import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvaliacaoDTO } from 'src/app/sistema/mini-site/Avaliacao';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private baseUrl = `${environment.apiURLBase}/api/avaliacoes`;
  
  constructor(private http: HttpClient) {}

  criar(dto: AvaliacaoDTO): Observable<AvaliacaoDTO> {
    return this.http.post<AvaliacaoDTO>(this.baseUrl, dto);
  }

  listarPorProfissional(profissionalId: number): Observable<AvaliacaoDTO[]> {
    return this.http.get<AvaliacaoDTO[]>(`${this.baseUrl}/profissional/${profissionalId}`);
  }

  listarMinhas(): Observable<AvaliacaoDTO[]> {
    return this.http.get<AvaliacaoDTO[]>(`${this.baseUrl}/minhas`);
  }
}
