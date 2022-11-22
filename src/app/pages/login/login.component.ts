import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public forma!: FormGroup;
  user:any= {};
  constructor( public authService:AuthService, private fb: FormBuilder, private router : Router, private toastr: ToastrService)  {
    this.forma = this.fb.group({
    'email': ['', Validators.required],
    'contrasena': ['', Validators.required]
    }); 
  }

  ngOnInit(): void {}

  async Ingresar() {
    this.user.email=this.forma.get('email')!.value;
    this.user.password = this.forma.get('contrasena')!.value;
        
    try {
      const user = await this.authService.onLogin(this.user)
      if(user) {
        this.toastr.success("Ingresando...", 'BIENVENIDO');
        setTimeout(() => {
          this.router.navigate(['inicio']);
        }, 500);
      } else{
        this.toastr.error("Usuario y/o contraseña incorrectos", 'INGRESO')
      }
    } catch(error)
    {
      this.toastr.error("Usuario y/o contraseña incorrectos", 'INGRESO')
    }
  }

  registrar() {
    this.router.navigateByUrl("tipo-registro")
  }

  usuarioRapido(user:any) {
    this.forma.setValue({
      email:user.email,
      contrasena:user.contrasena
    });
  }
}