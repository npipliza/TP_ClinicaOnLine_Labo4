import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BaseDatosService } from 'src/app/services/base-datos.service';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css']
})
export class RegistroEspecialistaComponent implements OnInit {
  public forma!: FormGroup;
  user:any = {}
  especialidades :string[] = []
  foto:any;
  especialidadNueva:string;

  constructor(public authService:AuthService, private fb: FormBuilder, private router : Router, private toastr: ToastrService, public base : BaseDatosService)  {
    this.forma = this.fb.group({
      'nombre': ['', [Validators.required, this.spacesValidator]],
      'apellido': ['', [Validators.required, this.spacesValidator]],
      'edad': ['', [Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'email': ['', [Validators.required, this.spacesValidator]],
      'dni': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      'contrasena': ['', Validators.required],
      'foto': ['', Validators.required],
      'especialidadNueva': [''],
      'recaptcha': ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  async Registrar(){
    if(await this.authService.ChequearEmail(this.forma.get('email')!.value)==false){
      console.log("registrando");
      this.toastr.success('', 'Registrando')
      this.user.email=this.forma.get('email')!.value;
      this.user.password = this.forma.get('contrasena')!.value
      this.user.nombre = this.forma.get('nombre')!.value
      this.user.apellido = this.forma.get('apellido')!.value
      this.user.edad = this.forma.get('edad')!.value
      this.user.especialidad = this.especialidades
      this.user.dni = this.forma.get('dni')!.value
      this.user.foto = this.foto
      this.user.perfil = "especialista"
        const user = await this.authService.onRegisterEspecialista(this.user)
        if(user){ 
            this.toastr.success('Usuario Registrado.', 'REGISTRO')
            if(this.router.url=="/registro/especialista"){
              setTimeout(async () => {
                const usuario = await this.authService.onLogin(this.user)
                if(usuario){
                  console.info("usuario encontrado: ", usuario);
                  this.toastr.success("Ingresando...", 'BIENVENIDO');
                  setTimeout(() => {
                    this.router.navigate(['inicio']);
                  }, 500);
                } else {
                  this.toastr.error("Hubo un error", 'REGISTRO')
                }
              }, 3000);
            }
          }

    }
    else
    {
      this.toastr.error("El correo ingresado ya se encuentra registrado.", 'REGISTRO')
    }
  }

  agregarEspecialidad(esp : string){
    if(esp != ""){
      this.especialidades.push(esp)
    }
    else{
      this.toastr.error("Debe ingresar una especialidad.", 'ESPECIALIDADES')
    }
  }
  
  elegirFoto(event:any){
    this.foto = event.target.files[0];
  }

  quitarEspecialidad(esp : any){
    this.especialidades.splice(this.especialidades.findIndex((object) => {
      return object == esp;
    }), 1)
  }

  subirEspecialidad(){
    if(this.forma.get('especialidadNueva')!.value == ""){
      this.toastr.error("Debe ingresar una especialidad", 'ESPECIALIDADES')
    }
    else{
      this.base.agregarEspecialidades(this.forma.get('especialidadNueva')!.value)
    }
  }

  ingresar(){
    this.router.navigateByUrl("")
  }

  usuario(){
    this.router.navigateByUrl("registrar")
  }

  private spacesValidator(control: AbstractControl): null | object {
    const palabra = <string>control.value;
    const spaces = palabra.includes(' ');
    return spaces
      ? { containsSpaces: true }
      : null; 
  }
}