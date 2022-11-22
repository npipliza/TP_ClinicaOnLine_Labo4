import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  ingresar()
  {
    this.router.navigateByUrl("")
  }

  volver()
  {
    this.router.navigateByUrl("/tipo-registro")
  }

}
