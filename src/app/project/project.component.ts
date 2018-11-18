import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router'
import { Project } from '../project';
import { UseCase } from '../usecase'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project: Project;
  useCaseId: Array<any>;
  useCases: Array<UseCase>;
  selectedUseCase: UseCase;


  constructor(private _dataService: DataService, private router: Router) {
    this.retProjectInfo();
  }

  retProjectInfo(){
    let projectDbId = sessionStorage.getItem("currentProject");
    this._dataService.getProject(projectDbId)
    .subscribe(res => {
      let json = res.json();
      this.project = json.data;
      this.useCaseId = this.project.useCases;
      console.log(this.project);
      this.retProjectUseCases();
    });
  }

  retProjectUseCases(){
    this.useCaseId.forEach(id => {
      this._dataService.getUseCase(id)
      .subscribe(res => {
        let json = res.json();
        this.useCases.push(json.data);
        console.log(json.data);
      });
    });
  }

  ngOnInit() {
  }

  onSelect(usecase: UseCase) {
    this.selectedUseCase = usecase;
  }

  createUseCase(){
    
  }

}
