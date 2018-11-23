import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Project } from '../project';
import { UseCase } from '../usecase';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result: any;

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get('/api/users');
  }

  getUser(userId: number) {
    return this._http.get('/api/user/' + String(userId));
  }

  getProjects() {
    return this._http.get('/api/projects');
  }

  getProject(projectId: string) {
    return this._http.get('/api/projects/' + projectId);
  }

  getUseCase(useCaseId: string){
    return this._http.get('/api/usecase/' + useCaseId);
  }

  submitUseCase(useCase: UseCase){
    this._http.post('/api/submitusecase', useCase);
  }
}
