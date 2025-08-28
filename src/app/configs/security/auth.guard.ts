import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const permissoesValidas = new Set<TipoUsuario>([
        TipoUsuario.ADMIN,
        TipoUsuario.PROFISSIONAL,
        TipoUsuario.CLIENTE
      ])
    

      return this.authService.getUsuarioComCache$().pipe(
        map(usuario => {
          if (!usuario) return this.router.createUrlTree(['/login']); 
          return permissoesValidas.has(usuario.tipoUsuario)
            ? true
            : this.router.createUrlTree(['/forbidden']);
        })
      );
  }
  
}
