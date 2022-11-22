import { TurnosSrvService } from 'src/app/services/turnos.service';
import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BaseDatosService } from 'src/app/services/base-datos.service';
import { slideInAnimation } from 'src/app/animations';
import { SpinnerService } from 'src/app/services/spinner.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class InicioComponent implements OnInit {

  constructor(private SpinnerService: SpinnerService, private contexts: ChildrenOutletContexts, private router:Router, public auth :AuthService, private toastr:ToastrService, public turnosSrv:TurnosSrvService, public base :BaseDatosService) 
  {  }

  ngOnInit(): void { this.SpinnerService.show();}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  salir(){ 
   

    this.auth.LogOut();this.toastr.success("Saliendo...", 'SALIR');
  }
}