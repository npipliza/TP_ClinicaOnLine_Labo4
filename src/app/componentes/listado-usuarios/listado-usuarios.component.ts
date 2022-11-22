import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { TurnosSrvService } from 'src/app/services/turnos.service';


@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent implements OnInit {

  constructor(public auth : AuthService, public turnosSrv : TurnosSrvService) { }

  ngOnInit(): void {
  }

  turnosFiltrados:any[];

  generarExcel() {
    //Creo el libro de excel
    let workbook = new Workbook();

    //Creo la hoja de excel
    let worksheet = workbook.addWorksheet("Listado de Usuarios");

    //Agrego los titulos de la hoja
    let header = ["Nombre", "Apellido", "Edad", "DNI", "Correo", "Perfil"];
    let headerRow = worksheet.addRow(header);

    for (let item of this.auth.usuarios) {
      let aux = [item.nombre ,  item.apellido , item.edad , item.dni , item.email , item.perfil ];

      worksheet.addRow(aux);
    }

    let fname = "Listado de Usuarios";

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

  generarExcelUsuario(usuario:any)
  {
    this.filtrarTurnos(usuario)
      //Creo el libro de excel
    let workbook = new Workbook();

    //Creo la hoja de excel
    let worksheet = workbook.addWorksheet("Turnos de " + usuario.nombre + " " +usuario.apellido);

    //Agrego los titulos de la hoja
    let header = ["Fecha", "Especialidad", "Especialista", "estado"];
    let headerRow = worksheet.addRow(header);

    for (let item of this.turnosFiltrados) {
      let aux = [item.fecha , item.especialidad , item.especialista.apellido +", "+ item.especialista.nombre, item.estado ];

      worksheet.addRow(aux);
    }

    let fname = "Turnos de " + usuario.nombre + " " +usuario.apellido;

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

  filtrarTurnos(usuario:any)
  {
    this.turnosFiltrados = this.turnosSrv.turnos.filter(turno=> turno.paciente.uid == usuario.uid)
  }
}
