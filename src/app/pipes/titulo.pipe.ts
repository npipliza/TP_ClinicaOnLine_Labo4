import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titulo'
})
export class TituloPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {

    if(value.length <= 15)
    {
      return "HOLA " + value.toUpperCase()+"!"
    }
    else
    {
      return "BIENVENIDO!";
    }
  }

}
