import { Component, OnInit } from '@angular/core';
import { BaseDatosService } from 'src/app/services/base-datos.service';
import { TurnosSrvService } from 'src/app/services/turnos.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  constructor(private toastr: ToastrService,public base : BaseDatosService, public turnosSrv : TurnosSrvService, public auth : AuthService) { }
  turnosFiltrados:any[]               = null;
  mostrarFiltro:boolean               = false;
  mostrarSelector:boolean             = false
  mostrarFiltroEspecialistas:boolean  = false;
  mostrarFiltroEspecialidades:boolean = false;
  mostrarFiltroPacientes:boolean      = false;
  mostrarCancelar:boolean             = false;
  turnoSeleccionado:any;
  searchParam:string = "";
  razon:string       = "";

  ngOnInit(): void {
    this.turnosFiltrados = this.turnosSrv.turnos
  }

  MostrarCancelar(turno:any){
    this.turnoSeleccionado = turno;
    this.mostrarCancelar = true
  }

  async CancelarTurno()
  {
    if(this.razon == "" || this.razon == null ){
      this.toastr.error("Debe agregar el motivo.", 'CANCELACIONES')
    } else {
      let razon = this.auth.UsuarioActivo.perfil +": "+this.razon
      await this.turnosSrv.cancelar(this.turnoSeleccionado, razon).then(()=>{
        this.mostrarCancelar = false;
        this.turnoSeleccionado = null
        this.turnosFiltrados = this.turnosSrv.turnos
      })
    }
  }

  hacerBusqueda() {
    if (this.searchParam === "") {
      this.turnosFiltrados = this.turnosSrv.turnos;
      return;
    }
    const serachParamLower = this.searchParam.toLowerCase();
    this.turnosFiltrados = this.turnosSrv.turnos.filter(turno => this.doSearch(turno, serachParamLower));
  }

  doSearch(value, searcher) {
    if (typeof value === 'boolean') {
      return false;
    }

    if (typeof value === 'object') {
      for (let fieldKey in value) {
        if (!this.estaEnLaListaNegraDeKeys(fieldKey) && this.doSearch(value[fieldKey], searcher)) {
          return true;
        }
      }
      return false;
    }
    return (typeof value == "string" ? value.toLocaleLowerCase() : value.toString()).includes(searcher)
  }

  estaEnLaListaNegraDeKeys(key) {
    return ["especialidades", "foto", "foto1", "foto2"].indexOf(key) != -1
  }
}
