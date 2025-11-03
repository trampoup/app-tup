import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export type MidiaSlot = 'banner' | 'video' | 'foto_perfil';

@Injectable({ providedIn: 'root' })
export class UsuarioMidiasService {
  private baseUrl = environment.apiURLBase + '/api/usuarios/midias';

  constructor(private http: HttpClient) {}

  upload({ banner, video, fotoPerfil }: { banner?: File | null; video?: File | null; fotoPerfil?: File | null }): Observable<any> {
    const form = new FormData();
    if (banner) form.append('banner', banner);
    if (video) form.append('video', video);
    if (fotoPerfil) form.append('fotoPerfil', fotoPerfil);
    return this.http.post(`${this.baseUrl}`, form, { reportProgress: true, observe: 'events' }) as Observable<HttpEvent<any>>;
  }

  getMinhaMidia(slot: MidiaSlot) {
    return this.http.get(`${this.baseUrl}/obter-minha-midia/${slot}`, {
      responseType: 'blob'
    });
  }

  getMidiaDoUsuario(slot: MidiaSlot, id : number | string){
    return this.http.get(`${this.baseUrl}/obter-midia-usuario/${id}/${slot}`, {
      responseType: 'blob'
    });
  }

  delete(slot: MidiaSlot): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${slot}`);
  }
}
