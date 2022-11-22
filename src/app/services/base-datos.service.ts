import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseDatosService {

  private itemsCollection?: AngularFirestoreCollection<any>;
  public especialidades: any[] = [];
  constructor(private authService: AuthService,private afs: AngularFirestore) {this.cargarEspecialidades()}


  cargarEspecialidades() {

    this.itemsCollection = this.afs.collection<any>('especialidades');
    return this.itemsCollection.valueChanges().subscribe(especialidades =>
      {
        this.especialidades=especialidades;
      })
  }

  agregarEspecialidades(especialidad: string) {
    let nuevaEspecialidad: any = {
      nombre: especialidad,
      foto:""
    };

    return this.afs.collection('especialidades').add(nuevaEspecialidad);
  }

}
