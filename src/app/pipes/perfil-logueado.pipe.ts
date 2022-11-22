import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'perfil'
})
export class PerfilPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch(value)
    {
      case 'admin':
        value="ADMINISTRADOR"
        break;

      case 'paciente':
      value="PACIENTE"
        break;


      case 'especialista':
        value="ESPECIALISTA"
        break;
    }
    return value;
  }

}
