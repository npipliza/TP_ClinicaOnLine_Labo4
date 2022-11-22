import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ChildrenOutletContexts, Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public forma!: FormGroup;
  foto:any;
  mostrarDetalle:boolean=false;
  especialista:any=null;
  user:any={};
  
  constructor(private toastr: ToastrService,private fb: FormBuilder, public auth : AuthService, private router:Router)  {}

  ngOnInit(): void {}

  MostrarDetale(especialista:any){
    this.mostrarDetalle=true;
    this.especialista = especialista
  }

  altaAdmin(){
    this.router.navigateByUrl('usuarios')
    this.mostrarDetalle=false;
  }

  altaUsuario(){
    this.router.navigateByUrl('usuario-registrar')
    this.mostrarDetalle=false;
  }

  altaEspecialista(){
    this.router.navigateByUrl('especialista-registrar')
    this.mostrarDetalle=false;
  }

  aprobar(uid:string){
    this.auth.aprobarEspecialista(uid)
  }
}
