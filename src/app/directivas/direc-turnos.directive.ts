import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appColorTurnos]'
})
export class DirecTurnosDirective implements OnInit {

  constructor(private el: ElementRef) 
  {
    
  }
  ngOnInit(): void {
    this.highlight() 
  }

  @Input() appColorTurnos = '';


  private highlight() {

    switch(this.appColorTurnos)
    {
      case "finalizado":
        this.el.nativeElement.style.backgroundColor = "#4908fc";
        break;

      case "cancelado":
        this.el.nativeElement.style.backgroundColor = "#7f9493";
        break;

      case "rechazado":
        this.el.nativeElement.style.backgroundColor = "#e31414";
        break;

      case "aceptado":
          this.el.nativeElement.style.backgroundColor = "#0fd5fc";
          break;


      case "pendiente":
        this.el.nativeElement.style.backgroundColor = "#c4ff03";
        break;
    }
  }

}
