import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataService } from './_services/data.service';
import { AuthService } from './_services/auth.service';
import { LoginComponent } from './login/login.component';
import { ProjecthomeComponent } from './projecthome/projecthome.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'projects', component: ProjecthomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjecthomeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpModule
  ],
  exports: [RouterModule],
  providers: [
    DataService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
