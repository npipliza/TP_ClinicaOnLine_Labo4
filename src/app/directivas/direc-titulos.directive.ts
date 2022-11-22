import { ThisReceiver } from '@angular/compiler';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appDirecTitulos]'
})
export class DirecTitulosDirective {

  constructor(private el: ElementRef) 
  {
    console.log("dire")
  }

  familias = ["Times New Roman", "Arial", "Helvetica", "sans-serif", "Trebuchet MS", "Georgia","Gill Sans",
   "cursive", "monospace", "fantasy", "math", "ui-rounded", "emoji"]
  bandera = false;
  numAnterior=-1;

  ngOnInit(): void {
    
  }

  @Input() appDirecTitulos = '';

  @HostListener('mouseenter') async onMouseEnter() 
  {
    const timer = ms => new Promise(res => setTimeout(res, ms))
    this.bandera=true
    await this.highlight(true);
    do
    {
      await timer(250);
      await this.highlight(true);
    }
    while(this.bandera)
  }

  @HostListener('mouseleave') async onMouseLeave() {
    this.bandera = false;
    await this.highlight(false);
  }


  async highlight(opcion:boolean) 
  {

    if(opcion)
    {
      let num = Math.floor(Math.random() * (this.familias.length - 1))

      console.log(num)
      console.log(this.familias[num])

      let requiredStyles = {
        'font-family': this.familias[num]
       };

      await Object.keys(requiredStyles).forEach(newStyle => {
        this.el.nativeElement.style.setProperty(
             `${newStyle}`,requiredStyles[newStyle]);
       });

    }
    else
    {
      let requiredStyles = {
        'font-family': "Arial"
       };
       await Object.keys(requiredStyles).forEach(newStyle => {
        this.el.nativeElement.style.setProperty(
             `${newStyle}`,requiredStyles[newStyle]);
       });
    }
  }

}
