import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { environment } from "./../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { ToastrModule } from 'ngx-toastr';
import { RegistroEspecialistaComponent } from './pages/registro-especialista/registro-especialista.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { LogRegBaseComponent } from './pages/log-reg-base/log-reg-base.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { RegistrosComponent } from './componentes/registros/registros.component';
import { ListadoUsuariosComponent } from './componentes/listado-usuarios/listado-usuarios.component';
import { RegistroImgsComponent } from './componentes/registro1/registro1.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { IniciosComponent } from './componentes/inicios/inicios.component';
import { TituloPipe } from './pipes/titulo.pipe';
import { PerfilPipe } from './pipes/perfil-logueado.pipe';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { FormatoFechaPipe } from './pipes/fto-fecha.pipe';
import { DirecPerfilDirective } from './directivas/direc-perfil.directive';
import { DirecTurnosDirective } from './directivas/direc-turnos.directive';
import { DirecTitulosDirective } from './directivas/direc-titulos.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InicioComponent,
    RegistroEspecialistaComponent,
    UsuariosComponent,
    LogRegBaseComponent,
    RegisterAdminComponent,
    RegistrosComponent,
    ListadoUsuariosComponent,
    RegistroImgsComponent,
    BienvenidaComponent,
    IniciosComponent,
    TituloPipe,
    PerfilPipe,
    MiPerfilComponent,
    MisTurnosComponent,
    SolicitarTurnoComponent,
    TurnosComponent,
    PacientesComponent,
    GraficosComponent,
    FormatoFechaPipe,
    DirecPerfilDirective,
    DirecTurnosDirective,
    DirecTitulosDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    ToastrModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFireAuthModule,
     provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    NgxCaptchaModule,
    MdbCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
