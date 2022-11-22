import { Component, OnInit } from '@angular/core';
import { Chart,registerables} from 'chart.js';
import { TurnosSrvService } from 'src/app/services/turnos.service';
import { AuthService } from 'src/app/services/auth.service';
import { BaseDatosService } from 'src/app/services/base-datos.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  constructor(public turnosSrv:TurnosSrvService, public auth:AuthService, public baseSrv: BaseDatosService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.turnosSrv.traerTurnos()
    this.auth.traerEspecialistas()
    this.baseSrv.cargarEspecialidades()
    this.auth.traerIngresos()
    setTimeout(() => {
      this.crearGraficoDias()
      this.crearGraficoEspecialidad()
      this.crearGraficoMedico()
    }, 500);
    setTimeout(() => {
      this.mostrar=true
    }, 1000);
  }

  mostrar=false

  crearGraficoDias(){
    const ctx = (<any>document.getElementById('graficoDias')).getContext('2d');    
    let turnosPorDIa = [0,0,0,0,0,0]

    this.turnosSrv.turnos.forEach(turno => {
      let diaSeparado = turno.fecha.split('/')
      let año = diaSeparado[2].split(",")
      let dia = new Date(Date.parse(diaSeparado[1]+"-"+diaSeparado[0]+"-"+año[0])).getDay()
      turnosPorDIa[dia-1] += 1
    });

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
          datasets: [{
              label: 'Turnos por día',
              data: turnosPorDIa,
              backgroundColor: [
                '#a5ff09',
                '#e01295',
                '#3de5ff',
                '#074dd9',
                '#fa684b',
                '#9609ed',
                '#f21b1b',
              ],
              borderColor: [
                  '#000'
              ],
              borderWidth: 1
          }]
      },
      options: {
        maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
    });
  }

  crearGraficoEspecialidad(){
    const ctx = (<any>document.getElementById('graficoEspecialidad')).getContext(
      '2d'
    );    

    let nombres = []
    let datos =[]
    this.baseSrv.especialidades.forEach(especialidad => {

      nombres.push(especialidad.nombre)
      let numeroTurnos = this.turnosSrv.turnos.filter(turno => turno.especialidad == especialidad.nombre);
      datos.push(numeroTurnos.length)

    });

    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: nombres,
          datasets: [{
              label: 'Turnos',
              data: datos,
              backgroundColor: [
                '#a5ff09',
                '#e01295',
                '#3de5ff',
                '#074dd9',
                '#fa684b',
                '#9609ed',
                '#f21b1b',
              ],
              borderColor: [
                '#000'
              ],
              borderWidth: 1
          }]
      },
      options: {
        maintainAspectRatio: false,

      }
    });
  }

  crearGraficoMedico(){
    const ctx = (<any>document.getElementById('graficoMedico')).getContext(
      '2d'
    );    

    let nombres = []
    let datos =[]
    this.auth.especialistas.forEach(espe => {

      nombres.push(espe.apellido)
      let numeroTurnos = this.turnosSrv.turnos.filter(turno => turno.especialista.uid == espe.uid);
      datos.push(numeroTurnos.length)

    });

    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: nombres,
          datasets: [{
              label: '# of Votes',
              data: datos,
              backgroundColor: [
                '#a5ff09',
                '#e01295',
                '#3de5ff',
                '#074dd9',
                '#fa684b',
                '#9609ed',
                '#f21b1b',
              ],
              borderColor: [
                '#000'
              ],
              borderWidth: 1
          }]
      },
      options: {
        maintainAspectRatio: false
      }
    });
  }


  descargarPdf(id:string): void {
    const DATA = document.getElementById(id);
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`${new Date().toISOString()}_grafico.pdf`);
      });
  }
}
