import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private autentificador : AuthService, private router:Router,private toastr: ToastrService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verificar()
  }

  verificar(){
    if(this.autentificador.isLogged){
      return true;
   }
   else{
    this.toastr.error("Debe ingresar sus datos.", 'PERMISOS')
    this.router.navigate([''])
   }
   return false
  }
}