import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../project';
import { UseCase } from '../usecase';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result: any;

  constructor(private _http: HttpClient) { }

  // USER CONTROL

  getUser(userId: number) {
    return this._http.get('/api/user/' + String(userId));
  }

  getUsers() {
    return this._http.get('/api/users');
  }

  createUser(user: User){
    this._http.post<User>('/api/user/create', user).subscribe((obj) => {console.log(obj)});
  }

  updateUser(user: User){
    this._http.post<User>('/api/user/update', user).subscribe((obj) => {console.log(obj)});
  }

  deleteUser(user: User){
    this._http.post<User>('/api/user/delete', user).subscribe((obj) => {console.log(obj)});
  }

  // PROJECT CONTROL

  getProject(projectId: string) {
    return this._http.get('/api/projects/' + projectId);
  }

  getProjects() {
    return this._http.get('/api/projects');
  }

  createProject (project: Project){
    this._http.post<Project>('/api/project/create', project).subscribe((obj)=> {console.log(obj)});
  }

  updateProject(project: Project){
    this._http.post<Project>('/api/project/update', project).subscribe((obj)=>{console.log(obj)});
  }

  deleteProject(project: Project){
    this._http.post<Project>('/api/project/delete', project).subscribe((obj)=>{console.log(obj)});
  }

  // USE CASE CONTROL

  getUseCase(useCaseId: string) {
    return this._http.get('/api/usecase/' + useCaseId);
  }

  getUseCases() {
    return this._http.get('/api/usecases')
  }

  createUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/usecase/create', useCase).subscribe((obj)=>{console.log(obj)});
  }

  updateUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/usecase/update', useCase).subscribe((obj)=>{console.log(obj)});
  }

  deleteUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/usecase/delete', useCase).subscribe((obj)=>{console.log(obj)});
  }
}
