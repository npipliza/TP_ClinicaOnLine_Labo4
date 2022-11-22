import { Component, OnInit } from '@angular/core';
import { BaseDatosService } from 'src/app/services/base-datos.service';
import { TurnosSrvService } from 'src/app/services/turnos.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  constructor(private toastr: ToastrService,public base : BaseDatosService, private fb: FormBuilder, public turnosSrv : TurnosSrvService, public auth : AuthService) { }

  ngOnInit(): void {
    this.turnosFiltrados = this.turnosSrv.turnos.filter(turno=> turno.especialista.uid == this.auth.UsuarioActivo.uid)
    let bandera = false
    this.turnosFiltrados.forEach(turno => {
      if(this.PacientesAtendidos.length===0 && turno.estado =="finalizado"){
        this.PacientesAtendidos.push(turno.paciente)
      }else{
        this.PacientesAtendidos.forEach(paciente => {
          if(turno.paciente.uid == paciente.uid){bandera=true}
        });
        if(!bandera){
          if(turno.estado =="finalizado"){
            this.PacientesAtendidos.push(turno.paciente)
          }
        }
        bandera = false
      }
    });
  }

  turnosFiltrados:any[];
  turnosFiltradosUsuario:any[];
  PacientesAtendidos:any[]=[];
  searchParam:string="";
  mostrarHistoriales=false;
  historialesFiltrados:any[]=[]
  mostrarTurnos=false;
  mostrarResena=false;
  TurnoSeleccionado=null

  VerHistoriales(uidPaciente:string) {
    this.turnosSrv.turnos.forEach(turno => {
      if(turno.estado == "finalizado" && turno.paciente.uid == uidPaciente){
        this.historialesFiltrados.push(turno.historial)
      }
    });
    this.mostrarHistoriales = true
  }

  VerTurnos(paciente:any){
    this.turnosFiltradosUsuario = []
    this.turnosFiltradosUsuario = this.turnosFiltrados.filter(turno=> turno.paciente.uid == paciente.uid)
    this.mostrarTurnos = true
  }

  MostrarResena(turno:any){
    this.TurnoSeleccionado = turno;
    this.mostrarResena = true
  }

  CerrarResena(){
    this.TurnoSeleccionado = null;
    this.mostrarResena = false
  }

  cerrarHistoriales() {
    this.mostrarHistoriales = false
    this.historialesFiltrados =[]
  }

  hacerBusqueda() {
    const serachParamLower = this.searchParam.toLowerCase();
      this.turnosFiltrados = this.turnosSrv.turnos.filter(turno=> turno.especialista.uid == this.auth.UsuarioActivo.uid)
      let bandera = false
      this.turnosFiltrados.forEach(turno => {
        if(this.PacientesAtendidos.length===0) {
          this.PacientesAtendidos.push(turno.paciente)
        } else {
          this.PacientesAtendidos.forEach(paciente => {
            if(turno.paciente.uid == paciente.uid){bandera=true}
          });
          if(!bandera) {
            if(turno.estado =="finalizado")
            {
              this.PacientesAtendidos.push(turno.paciente)
            }
          }
          bandera = false
        }
      });
    if (this.searchParam === "") {
      return;
    }
    this.PacientesAtendidos = this.PacientesAtendidos.filter(paciente => this.doSearch(paciente, serachParamLower));
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