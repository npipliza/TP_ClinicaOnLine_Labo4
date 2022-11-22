import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})

export class RegisterAdminComponent implements OnInit {
  public forma!: FormGroup;
  foto:any;
  especialista:any=null;
  user:any={};

  constructor(private toastr: ToastrService,private fb: FormBuilder, public auth : AuthService) {
    this.forma = this.fb.group({ 'nombre': ['', [Validators.required, this.spacesValidator]], 'apellido': ['', [Validators.required, this.spacesValidator]], 'edad': ['', [Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]], 'email': ['', [Validators.required, this.spacesValidator]], 'dni': ['', Validators.required, Validators.pattern("^[0-9]*$")], 'contrasena': ['', Validators.required], 'foto': ['', Validators.required], 'recaptcha': ['', Validators.required]});
  }

  ngOnInit(): void {}

  elegirFoto(event:any){
    this.foto = event.target.files[0];
  }

  async Registrar(){
    if(!this.forma.invalid){
      if(await this.auth.ChequearEmail(this.forma.get('email')!.value)==false){
        console.log("registroo ok");
        this.toastr.success('', 'Validando registro')
        this.user.email    = this.forma.get('email')!.value;
        this.user.password = this.forma.get('contrasena')!.value
        this.user.nombre   = this.forma.get('nombre')!.value
        this.user.apellido = this.forma.get('apellido')!.value
        this.user.edad     = this.forma.get('edad')!.value
        this.user.dni      = this.forma.get('dni')!.value
        this.user.foto     = this.foto
        const user         = await this.auth.onRegisterAdmin(this.user)
      }else{
        this.toastr.error("El correo ingresadO ya se encuentra registrado.", 'REGISTRO')
      }
    }else{
      this.toastr.error("Por favor, completar ambos casilleros correctamente.", 'REGISTRO')
    }
  }

  private spacesValidator(control: AbstractControl): null | object {
    const palabra = <string>control.value;
    const spaces  = palabra.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null; 
  }
}
