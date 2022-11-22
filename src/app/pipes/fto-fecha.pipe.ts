import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoFecha'
})
export class FormatoFechaPipe implements PipeTransform {

  transform(fecha: string): string {

    let fechaSeparado = fecha.split(',')
    let dias = fechaSeparado[0].split("/")

    let diaFormateado = dias[0] + "/" + dias[1] + ", " +fechaSeparado[1]
    return diaFormateado;
  }

}
