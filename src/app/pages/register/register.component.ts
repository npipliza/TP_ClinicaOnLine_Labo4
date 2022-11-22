import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public forma!: FormGroup;
  user:any = {}
  foto1:any;
  foto2:any;
  constructor(public authService:AuthService, private fb: FormBuilder,private router : Router,private toastr: ToastrService) 
  {
    this.forma = this.fb.group({
      'nombre': ['', [Validators.required, this.spacesValidator]],
      'apellido': ['', [Validators.required, this.spacesValidator]],
      'edad': ['', [Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'email': ['', [Validators.required, this.spacesValidator]],
      'dni': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      'contrasena': ['', Validators.required],
      'obra': ['', Validators.required],
      'foto1': ['', Validators.required],
      'foto2': ['', Validators.required],
      'recaptcha': ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  async Registrar(){
    if(this.forma.invalid) {
      this.toastr.error("Debe compeltar todos los campos con el formato correcto!", 'REGISTRAR')
    }else {
      if(await this.authService.ChequearEmail(this.forma.get('email')!.value)==false) {
        console.log("registrando");
        this.toastr.success('', 'Registrando')
        this.user.email=this.forma.get('email')!.value;
        this.user.password = this.forma.get('contrasena')!.value
        this.user.nombre = this.forma.get('nombre')!.value
        this.user.apellido = this.forma.get('apellido')!.value
        this.user.edad = this.forma.get('edad')!.value
        this.user.obra = this.forma.get('obra')!.value
        this.user.dni = this.forma.get('dni')!.value
        this.user.foto1 = this.foto1
        this.user.foto2 = this.foto2
          const user = await this.authService.onRegisterUsuario(this.user)
          if(user){
              console.log('Exito! Usuario Registrado')
              this.toastr.success('Usuario Registrado', 'REGISTRAR')
              if(this.router.url=="/registro") {
                setTimeout(async () => {
                  const user = await this.authService.onLogin(this.user)
                  if(user) {
                    console.info("usuario encontrado: ", user);
                    this.toastr.success("Ingresando...", 'BIENVENIDO');
                    setTimeout(() => {
                      this.router.navigate(['inicio']);
                    }, 500);
                  } else {
                    this.toastr.error("Ha ocurrido un error al ingresar.", 'REGISTRAR')
                  }
                }, 3000);
              }
            }
      } else {
        this.toastr.error("La dirección de correo ya se encuentra en uso.", 'REGISTRAR')
      }
    }
  }

  ingresar(){
    this.router.navigateByUrl("")
  }

  especialista(){
    this.router.navigateByUrl("registrar-especialista")
  }

  elegirFoto1(event:any){
    this.foto1 = event.target.files[0];
  }

  elegirFoto2(event:any){
    this.foto2 = event.target.files[0];
  }
  
  private spacesValidator(control: AbstractControl): null | object {
    const palabra = <string>control.value;
    const spaces = palabra.includes(' ');
    return spaces
      ? { containsSpaces: true }
      : null; 
  }
}