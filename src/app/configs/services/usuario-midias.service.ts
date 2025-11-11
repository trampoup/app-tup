import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

export type MidiaSlot = 'banner' | 'video' | 'foto_perfil';

@Injectable({ providedIn: 'root' })
export class UsuarioMidiasService {
  private baseUrl = environment.apiURLBase + '/api/usuarios/midias';
  private cache = new Map<number, string | null>();

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

  getFotoPerfilDataUrl(idUsuario: number, withCreds = false): Observable<string | null> {
    if (this.cache.has(idUsuario)) {
      return of(this.cache.get(idUsuario)!);
    }

    return this.http.get(`${this.baseUrl}/obter-midia-usuario/${idUsuario}/foto_perfil`, {
      responseType: 'blob',
      withCredentials: withCreds
    }).pipe(
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
      map((dataUrl) => {
        this.cache.set(idUsuario, dataUrl);
        return dataUrl;
      }),
      catchError(() => {
        this.cache.set(idUsuario, null);
        return of(null);
      })
    );
  }

  getFotosPerfilDaPagina(ids: number[], withCreds = false): Observable<Record<number, string | null>> {
    const tarefas = ids.map((id) =>
      this.getFotoPerfilDataUrl(id, withCreds).pipe(map((url) => [id, url] as const))
    );
    if (!tarefas.length) return of({});
    return forkJoin(tarefas).pipe(
      map((pares) =>
        pares.reduce((acc, [id, url]) => {
          acc[id] = url;
          return acc;
        }, {} as Record<number, string | null>)
      )
    );
  }

  clearCacheFor(id: number) { this.cache.delete(id); }
  clearAllCache() { this.cache.clear(); }

}
