import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private autentificador : AuthService, private router:Router,private toastr: ToastrService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verificar()
  }

  verificar(){
    if(this.autentificador.UsuarioActivo.perfil == 'admin'){
      return true;
   }else {
    this.toastr.error("Debe ser administrador para acceder a esta sección", 'PERMISOS')
   }
   return false
  }
}
