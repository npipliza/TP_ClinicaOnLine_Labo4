import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appColorMiPerfil]'
})
export class DirecPerfilDirective implements OnInit {

  constructor(private el: ElementRef) 
  {
    
  }
  ngOnInit(): void {
    this.highlight() 
  }

  @Input() appColorMiPerfil = '';


  private highlight() {

    switch(this.appColorMiPerfil)
    {
      case "admin":
        this.el.nativeElement.style.backgroundColor = "#F8E720";
        break;

      case "especialista":
        this.el.nativeElement.style.backgroundColor = "#20F88B";
        break;

      case "paciente":
        this.el.nativeElement.style.backgroundColor = "#FFAE19";
        break;
    }
  }
}
