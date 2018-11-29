import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './_guards/auth.guard';

import { AppComponent } from './app.component';
import { DataService } from './_services/data.service';
import { AuthService } from './_services/auth.service';
import { LoginComponent } from './login/login.component';
import { ProjectHomeComponent } from './projecthome/projecthome.component';
import { ModalModule } from 'angular-custom-modal';
import { ProjectComponent } from './project/project.component';

import { ProjectResolver } from './project/project-resolver.service';
import { UseCaseHomeComponent } from './usecasehome/usecasehome.component';


const appRoutes: Routes = [
  {
    path: '',
    component: UseCaseHomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'project/:projectID',
    component:ProjectComponent,
    canActivate: [AuthGuard],
    resolve: {
      project: ProjectResolver
    }
  },
  {
    path: 'projects',
    component: ProjectHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usecases',
    component: UseCaseHomeComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectHomeComponent,
    ProjectComponent,
    UseCaseHomeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
//    HttpModule,
    HttpClientModule,
    ModalModule
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DataService,
    AuthService,
    ProjectResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
