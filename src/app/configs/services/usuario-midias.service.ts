import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

export type MidiaSlot = 'banner' | 'video' | 'foto_perfil';

export interface UsuarioMidiasResponseDTO {
  bannerUrl?: string | null;
  fotoPerfilUrl?: string | null;
  videoUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioMidiasService {
  private baseUrl = environment.apiURLBase + '/api/usuarios/midias';
  constructor(private http: HttpClient) {}

  upload(files: { banner?: File; video?: File; fotoPerfil?: File }): Observable<UsuarioMidiasResponseDTO> {
    const fd = new FormData();
    if (files.banner) fd.append('banner', files.banner);
    if (files.video) fd.append('video', files.video);
    if (files.fotoPerfil) fd.append('fotoPerfil', files.fotoPerfil);
    return this.http.post<UsuarioMidiasResponseDTO>(`${this.baseUrl}`, fd);
  }

  uploadWithProgress(files: { banner?: File; video?: File; fotoPerfil?: File }): Observable<HttpEvent<UsuarioMidiasResponseDTO>> {
    const fd = new FormData();
    if (files.banner) fd.append('banner', files.banner);
    if (files.video) fd.append('video', files.video);
    if (files.fotoPerfil) fd.append('fotoPerfil', files.fotoPerfil);

    return this.http.post<UsuarioMidiasResponseDTO>(this.baseUrl, fd, {
      observe: 'events',
      reportProgress: true,
    });
  }

  getMinhaMidia(slot: MidiaSlot): Observable<string | null> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/minha/${slot}`).pipe(
      map(r => r?.url ?? null),
      catchError(() => of(null))
    );
  }

  getMidiaDoUsuario(slot: MidiaSlot, id: number | string): Observable<string | null> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/usuario/${id}/${slot}`).pipe(
      map(r => r?.url ?? null),
      catchError(() => of(null))
    );
  }

  delete(slot: MidiaSlot): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${slot}`);
  }

  getFotosPerfilDaPagina(ids: number[]): Observable<Record<number, string | null>> {
    return this.http.post<Record<number, string | null>>(`${this.baseUrl}/fotos-perfil`, ids).pipe(
      catchError(() => of({}))
    );
  }

}
