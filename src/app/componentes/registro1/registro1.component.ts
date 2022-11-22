import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro1',
  templateUrl: './registro1.component.html',
  styleUrls: ['./registro1.component.css']
})
export class RegistroImgsComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  volver()
  {
    this.router.navigateByUrl("")
  }


  Administrador()
  {
    this.router.navigateByUrl("registro/admin")
  }

  Especialista()
  {
    this.router.navigateByUrl("registro/especialista")
  }

  usuario()
  {
    this.router.navigateByUrl("registro")
  }

}
