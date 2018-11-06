import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './_guards/auth.guard';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataService } from './_services/data.service';
import { AuthService } from './_services/auth.service';
import { LoginComponent } from './login/login.component';
import { ProjectHomeComponent } from './projecthome/projecthome.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: ProjectHomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectHomeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpModule
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DataService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
