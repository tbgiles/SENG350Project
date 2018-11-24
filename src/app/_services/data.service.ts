import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../project';
import { UseCase } from '../usecase';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result: any;

  constructor(private _http: HttpClient) { }

  getUser(userId: number) {
    return this._http.get('/api/user' + String(userId));
  }

  getUsers() {
    return this._http.get('/api/users');
  }

  getProject(projectId: string) {
    return this._http.get('/api/projects' + projectId);
  }

  getProjects() {
    return this._http.get('/api/projects');
  }

  getUseCase(useCaseId: string) {
    return this._http.get('/api/usecase' + useCaseId);
  }

  getUseCases() {
    return this._http.get('/api/usecases')
  }

  submitUseCase(useCase: UseCase){
    this._http.post<UseCase>('/api/submit/usecase', useCase).subscribe((obj)=>{console.log(obj)});
  }
}
