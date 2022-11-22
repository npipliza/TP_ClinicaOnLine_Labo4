import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseDatosService } from 'src/app/services/base-datos.service';
import { ToastrService } from 'ngx-toastr';
import { TurnosSrvService } from 'src/app/services/turnos.service';


@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit {

  constructor(private toastr: ToastrService,public auth : AuthService, public base : BaseDatosService, public turnosSrv :TurnosSrvService) { }
  flag_especialidad:boolean = true;
  flag_especialista:boolean = false;
  flag_Datos:boolean        = false;
  especialidadSeleccionada:string = null;
  especialistaSeleccionado:any    = null;
  public turnoSeleccionado: any;
  turnos:any[]         = []
  especialistas:any[]  = []
  especialidades:any[] = []

  ngOnInit(): void {
    this.especialidades = this.base.especialidades
    this.especialistas = this.auth.especialistas
  }

  seleccEspecialidad(especialidad:string){
    this.flag_especialidad = false ;
    this.flag_especialista =true;
    this.especialidadSeleccionada=especialidad
    this.especialistas = this.auth.especialistas.filter( espe => espe.especialidades.includes(especialidad))
  }

  seleccEspecialista(especialista:any){
    this.especialistaSeleccionado = especialista
    this.flag_especialista = false
    this.crearTurnos()
    this.flag_Datos = true;
  }

  crearTurnos(){
    const comienzoHorario = this.especialistaSeleccionado.comienzoA
    const finalHorario    = this.especialistaSeleccionado.finalA
    if ((finalHorario - comienzoHorario) <= 0) {
      this.toastr.error("El especialista no tiene horarios disponibles", 'TURNOS')
      return;
    }
    let hoy    = new Date();
    let dia    = new Date();
    let manana = new Date();
    let horaEntrada;
    let horaSalida;
    let duracionTurno = 30;
    let turnoConFormato;
    let ultimoTurno;

    for (let contador = 1; contador <= 5; contador++) {
      if(dia.getDay() !== 0) {
        ultimoTurno = dia;
        ultimoTurno.setHours(finalHorario, 0);
        if (dia.getDay() == 6) {
          ultimoTurno.setHours(14, 0);
        }
        ultimoTurno = new Date(ultimoTurno.getTime() - duracionTurno * 6000);
        dia.setHours(comienzoHorario, 0);
        do {
          turnoConFormato = dia.toLocaleString([], { day: '2-digit', month: '2-digit', year:'2-digit', hour: '2-digit', minute: '2-digit', });
          if (this.estaElTurnoDisponible(turnoConFormato)) {
            this.turnos.push(turnoConFormato);
          }
          dia = new Date(dia.getTime() + duracionTurno * 6000);
        } while (dia <= ultimoTurno);
      }
      manana.setDate(manana.getDate() + 1);
      dia = manana;
    }
  }

  estaElTurnoDisponible(fecha) {
    return !(this.turnosSrv.turnos.filter(turno =>
      turno.especialista.uid == this.especialistaSeleccionado.uid &&
      turno.fecha == fecha &&
      ["aceptado", "pendiente"].indexOf(turno.estado) != -1).length);
  }

  seleccionarTurno(turno) {
    this.turnoSeleccionado={
      paciente:this.auth.UsuarioActivo,
      especialista:this.especialistaSeleccionado,
      fecha:turno,
      especialidad:this.especialidadSeleccionada,
      estado:'pendiente',
      diagnostico:"",
      comentario_especialista:"",
      comentario_usuario:"",
      razon_cancelacion:"",
      historial:null
    }
    this.turnosSrv.agregarTurno(this.turnoSeleccionado);
    this.flag_especialidad = true;
    this.flag_especialista = false;
    this.flag_Datos = false;
  }
}