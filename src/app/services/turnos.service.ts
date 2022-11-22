import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TurnosSrvService {

  private Turnos?: AngularFirestoreCollection<any>;
  private Turnos2?: AngularFirestoreCollection<any>;
  public turnos: any[] = [];
  promiseTurnos:Subscription

  constructor(private toastr: ToastrService,public afAuth : AngularFireAuth,public afs: AngularFirestore,private router: Router)  {
    this.traerTurnos()
  }

  async agregarTurno(turno:any){
    let uid = this.afs.createId()
    turno.uid = uid
    await this.afs.collection('turnos').doc(uid).set(turno).catch((err) =>{
      this.toastr.error("Ha ocurrio un error al intentar reservar el turno.", 'SOLICITUD TURNOS')
    }).then(()=>{
      const swalWithBootstrapButtons = swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'SOLICITAR TURNO',
        text: "Sólo resta confirmar para tomar este turno",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: ' CONFIRMAR',
        cancelButtonText: 'CANCELAR ',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'TURNO ASIGNADO',
            'Podrás ver los detalles en MIS TURNOS',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === swal.DismissReason.cancel
        ) {
        }
      })
      // this.toastr.success("El turno ha sido reservado.",'SOLICITUD TURNOS')
    })
  }

  traerTurnos(){
    this.turnos = []
    this.Turnos =  this.afs.collection('turnos')
    this.promiseTurnos = this.Turnos.valueChanges().subscribe(esp =>
    {
      this.turnos = esp
    })
  }

  desSubscribir(){
    this.promiseTurnos.unsubscribe()
  }

  async cancelar(turno:any, razon :string){
    await this.afs.collection('turnos').doc(turno.uid).update({estado:"cancelado",razon_cancelacion: razon}).catch((err)=>{
      this.toastr.error("Ha ocurrio un error al intentar cancelar el turno.", 'SOLICITUD TURNOS')
    }).finally(()=>{
      this.toastr.success("El turno ha sido cancelado.", 'SOLICITUD TURNOS');
    })
  }

  async rechazar(turno:any){
    await this.afs.collection('turnos').doc(turno.uid).update({estado:"rechazado"}).catch((err)=>{
      this.toastr.error("Ha ocurrio un error al intentar rechazar el turno.", 'SOLICITUD TURNOS')
    }).finally(()=>{
      this.toastr.success("El turno ha sido rechazado.", 'SOLICITUD TURNOS');
    })
  }

  async aceptar(turno:any){
    await this.afs.collection('turnos').doc(turno.uid).update({estado:"aceptado"}).catch((err)=>{
      this.toastr.error("Ha ocurrio un error al intentar aceptar el turno.", 'SOLICITUD TURNOS')
    }).finally(()=> {
      this.toastr.success("El turno ha sido aceptado.", 'SOLICITUD TURNOS');
    })
  }

  async finalizar(turno:any, comentario:string, diagnostico:string, historial:any){
    await this.afs.collection('turnos').doc(turno.uid).update({
      estado:"finalizado",
      comentario_especialista:comentario,
      diagnostico:diagnostico,
      historial:historial
    }).catch((err)=>{
      this.toastr.error("Ha ocurrio un error al intentar finalizar.", 'CONSULTA')
    }).finally(()=> {
      this.toastr.success("El turno ha sido finalizado.", 'CONSULTA');
    })
  }

  traerTurnosSus(){
    const coleccion = this.afs.collection('usuarios');
    return coleccion.valueChanges();
  }

  async calificar(turno:any, comentario:string) {
    await this.afs.collection('turnos').doc(turno.uid).update({
      comentario_usuario:comentario
    }).catch((err)=>{
      this.toastr.error("Ha ocurrio un error al intentar calificar.", 'CALIFICACIONES')
    }).finally(()=>{
      this.toastr.success("El turno ha sido calificado.", 'CALIFICACIONES');
    })
  }
}