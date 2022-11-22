import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TurnosSrvService } from './turnos.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  siteKey :string = "6LdIhAkjAAAAAG-ZbQCPQFV-HbZmVgXFlfeQklBY"
  secretKey:string="6LdIhAkjAAAAAKYdmZRt_PMaCQfQHoGPypTZznOg"
  public isLogged: any = false;
  UsuarioActivo:any;
  promiseUsuario:Subscription
  promiseUsuarios:Subscription
  promisePacientes:Subscription
  promiseIngresos:Subscription
  promiseEspecialistas:Subscription
  promiseNoAprobados:Subscription
  uidUser="";

  private noAprobados?: AngularFirestoreCollection<any>;
  public noAprobadosA= [];
  private Ingresos?: AngularFirestoreCollection<any>;
  public ingresos= [];
  private UsuariosColeccion?: AngularFirestoreCollection<any>;
  public usuarios: any[] = [];
  private UsuariosLogin?: AngularFirestoreCollection<any>;
  public usuariosLogin: any[] = [];
  private Especialistas?: AngularFirestoreCollection<any>;
  public especialistas: any[] = [];
  private Pacientes?: AngularFirestoreCollection<any>;
  public pacientes: any[] = [];

  constructor(private toastr: ToastrService,public afAuth : AngularFireAuth,public afs: AngularFirestore,private router: Router,public turnos: TurnosSrvService)  {
    afAuth.authState.subscribe( user => (this.isLogged = user))
    this.TraerUsuariosLogin()
    this.traerEspecialistas()
    this.ObtenerNoAprobados()
    this.traerUsuarios()
    this.traerPacientes()
    this.traerIngresos()
  }

  traerUsuarios(){
    this.UsuariosColeccion = this.afs.collection<any>('usuarios');
    this.promiseUsuarios=  this.UsuariosColeccion.valueChanges().subscribe(usuarios =>{
        this.usuarios=usuarios;
      })
  }

  traerIngresos() {
    this.Ingresos = this.afs.collection<any>('Ingresos');
    this.promiseIngresos=  this.Ingresos.valueChanges().subscribe(ingresos => {
        this.ingresos=ingresos;
      })
  }
  
  async onLogin(user : any):Promise<any> {
    var retorno:any;
    retorno = await this.afAuth.signInWithEmailAndPassword(user.email, user.password)
    this.uidUser=retorno.user.uid
    if(retorno) {
      this.promiseUsuario = await this.afs.collection('usuarios').doc(this.uidUser).valueChanges().subscribe(async (usuario) =>{
          this.UsuarioActivo = usuario
          this.agregarLogin(usuario)
        });
    }
    return retorno;
  }

  async ChequearEmail(email:string) : Promise<boolean>{
    let flag=false;
    await this.afAuth.fetchSignInMethodsForEmail(email).then((result) => {
      if(result.length!=0)
      {
        flag = true;
      }
    });
    return flag;
  }

  async onRegisterEspecialista(user : any){
    try{
      var foto = await this.subirArchivos(user.foto)
      await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(async (cred) =>{
        await this.afs.collection('usuarios').doc(cred.user.uid).set({
          email:user.email,
          contrasena:user.password,
          nombre:user.nombre,
          apellido:user.apellido,
          edad:user.edad,
          especialidades:user.especialidad,
          dni:user.dni,
          foto: foto,
          uid:cred.user.uid,
          perfil:"especialista",
          aprobado:false,
          comienzoA:8,
          finalA:19
        })
        const usuario = await this.afAuth.currentUser;
        usuario.sendEmailVerification().then(()=>{
          console.log("Email ok")
        }).catch((error) => {
          console.log("error")
        })
      })
      return true;
    }catch(error){console.log("Error registro", error);return false}
  }

  async onRegisterAdmin(user : any) {
    try {
      var foto = await this.subirArchivos(user.foto)
      await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(async (cred) =>{
        await this.afs.collection('usuarios').doc(cred.user.uid).set({ email:user.email, contrasena:user.password, nombre:user.nombre, apellido:user.apellido, edad:user.edad, dni:user.dni, foto: foto, uid:cred.user.uid, perfil:"admin"
        }).finally(async ()=>{
          this.toastr.success("Se ha registrado correctamente.", 'REGISTRAR');
          const usuario = await this.afAuth.currentUser;
          usuario.sendEmailVerification().then(()=> {
            console.log("Email ok")
          }).catch((error) => {
            console.log("error")
          })
        })
      })
      return true;
    } catch(error){console.log("Error en register", error);this.toastr.error("No ha sido posible realizar el registro.", 'REGISTRAR');return false}
  }

  async onRegisterUsuario(user : any){
    try{
        var foto1 = await this.subirArchivos(user.foto1)
        var foto2 = await this.subirArchivos(user.foto2)
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(async (cred) =>{
          cred.user?.sendEmailVerification()
          await this.afs.collection('usuarios').doc(cred.user.uid).set({ email:user.email, contrasena:user.password, nombre:user.nombre, apellido:user.apellido, edad:user.edad, obra:user.obra, dni:user.dni, foto: foto1, foto2: foto2, uid:cred.user.uid, perfil:"paciente"
          }).then(async ()=>{
            const usuario = await this.afAuth.currentUser;
            usuario.sendEmailVerification().then(()=>{
              console.log("Email ok")
            }).catch((error) => {
              console.log("error")
            })
          })
        })
        return true;
    }catch(error){console.log("Error registro", error);this.toastr.error("No ha sido posible realizar el registro.", 'REGISTRAR');return false}
  }

  async subirArchivos(foto:any) : Promise<string> {
    var url: string = null
    const storage = getStorage();
    const storageRef = await ref(storage, `imagenes/${this.formatDate(new Date())}`)
    await uploadBytesResumable(storageRef, foto).then(async (snapshot)=>{
      await getDownloadURL(storageRef).then((downloadUrl) => {
        url = downloadUrl
      })
    })
    return url
  }

  LogOut(){
    this.Unsubscriber()
    this.afAuth.signOut();
    this.router.navigate(['']);
  }

  formatDate = (date: any) => {
    return date.toLocaleString()
  }

  ObtenerNoAprobados() {
    this.noAprobados = this.afs.collection('usuarios', ref => ref.where('aprobado', '==', false))
    this.promiseNoAprobados= this.noAprobados.valueChanges().subscribe(aprobados =>{
        this.noAprobadosA = []
        aprobados.forEach(a => {
          this.noAprobadosA.unshift(a);
        });
      })
  }

  TraerUsuariosLogin() {
     this.UsuariosLogin = this.afs.collection('usuarios', ref => ref.where('perfil', '==', "paciente").limit(3))
     this.UsuariosLogin.valueChanges().subscribe(usuarios =>{
      this.usuariosLogin = []
      usuarios.forEach(a => {
        this.usuariosLogin.unshift(a);
      });
    })
     this.UsuariosLogin =  this.afs.collection('usuarios', ref => ref.where('perfil', '==', "especialista").limit(2))
     this.UsuariosLogin.valueChanges().subscribe(usuarios =>{
      usuarios.forEach(a => {
        this.usuariosLogin.unshift(a);
      });
    })
    this.UsuariosLogin =  this.afs.collection('usuarios', ref => ref.where('perfil', '==', "admin").limit(1))
     this.UsuariosLogin.valueChanges().subscribe(usuarios =>{
      usuarios.forEach(a => {
        this.usuariosLogin.unshift(a);
      });
    })
  }

  aprobarEspecialista(uid:string){
    this.afs.collection('usuarios').doc(uid).update({aprobado:true}).catch((err)=>{
      this.toastr.error("No ha sido posible aprobar el usuario.", 'APROBACIONES')
    }).finally(()=>{
      this.toastr.success("El usuario ha sido aprobado correctamente.", 'APROBACIONES');
    })
  }

  cambiarHorariosEspecialista(comienzo:number, final:number){
    this.afs.collection('usuarios').doc(this.UsuarioActivo.uid).update({comienzoA:comienzo, finalA:final}).catch((err)=>{
      this.toastr.error("No ha sido posible realizar la modificación.", 'MODIFICAR HORARIOS')
    }).finally(()=>{
      this.toastr.success("Se realizó la modificación correctamente.", 'MODIFICAR HORARIOS');
    })
  }

  traerEspecialistas(){
    this.Especialistas =  this.afs.collection('usuarios', ref => ref.where('perfil', '==', "especialista").where('aprobado', '==', true))
    this.promiseEspecialistas= this.Especialistas.valueChanges().subscribe(esp =>{
      this.especialistas = esp
    })
  }

  traerPacientes() {
    this.Pacientes =  this.afs.collection('usuarios', ref => ref.where('perfil', '==', "paciente"))
    this.promisePacientes= this.Pacientes.valueChanges().subscribe(esp =>
    {
      this.pacientes = esp
    })
  }

  Unsubscriber(){
    this.promiseUsuario.unsubscribe()
  }

  agregarLogin(user : any){
    var login = {
      usuario:user.apellido+", "+user.nombre,
      perfil:user.perfil,
      fecha:this.formatDate(new Date())
    }
    this.afs.collection('Ingresos').add(login)
  }

  getAuth() {
    return this.afAuth.authState;
  }
}
