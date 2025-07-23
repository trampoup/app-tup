import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCadastroDTO } from 'src/app/cadastro/usuario-cadastro-dto';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './api-response-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrlLink = environment.apiURLBase + '/api/usuarios'; 

  constructor(private http:HttpClient) {}

  cadastrarUsuario(usuario: UsuarioCadastroDTO): Observable<ApiResponse<UsuarioCadastroDTO>> {
    return this.http.post<ApiResponse<UsuarioCadastroDTO>>(`${this.apiUrlLink}/cadastro`, usuario);
  }
  
}
