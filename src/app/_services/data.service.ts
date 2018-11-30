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

  getUser(userId: number) {
    return this._http.get('/api/user/' + String(userId));
  }

  getUsers() {
    return this._http.get('/api/users');
  }

  getProject(projectId: string) {
    return this._http.get('/api/projects/' + projectId);
  }

  getProjects() {
    return this._http.get('/api/projects');
  }

  getUseCase(useCaseId: string) {
    return this._http.get('/api/usecase/' + useCaseId);
  }

  getUseCases() {
    return this._http.get('/api/usecases')
  }

  submitUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/submit/usecase', useCase).subscribe((obj)=>{console.log(obj)});
  }
  submitProject (project: Project){
    this._http.post<Project>('/api/submit/project', project).subscribe((obj)=> {console.log(obj)});
  }

  submitUser(user: User){
    this._http.post<User>('/api/submit/user', user).subscribe((obj) => {console.log(obj)});
  }

  updateUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/update/usecase', useCase).subscribe((obj)=>{console.log(obj)});
  }

  updateProject(project: Project){
    this._http.post<Project>('/api/update/project', project).subscribe((obj)=>{console.log(obj)});
  }

  updateUser(user: User){
    this._http.post<User>('/api/update/user', user).subscribe((obj) => {console.log(obj)});
  }

  dropUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/drop/usecase', useCase).subscribe((obj)=>{console.log(obj)});
  }

  dropProject(project: Project){
    this._http.post<Project>('/api/drop/project', project).subscribe((obj)=>{console.log(obj)});
  }

  dropUser(user: User){
    this._http.post<User>('/api/drop/user', user).subscribe((obj) => {console.log(obj)});
  }
}
