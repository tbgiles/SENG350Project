import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'
import { Project } from '../project';
import { UseCase } from '../usecase';
import { ProjectResolver } from './project-resolver.service';
import { map } from 'rxjs/operators';

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
  projectID: any

  constructor(private _dataService: DataService, private router: Router, private actr: ActivatedRoute) {

    this.actr.data.subscribe(res => {
      this.projectID = res.project
      this.retProjectInfo();
    });
  }


// TODO: Fix the usecase issue

  retProjectInfo(){
    this._dataService.getProject(this.projectID)
    .subscribe(res => {
      let json = res.json();
      this.project = json.data;
      this.useCaseId = this.project.useCases;
      this.retProjectUseCases();
    });
  }

  retProjectUseCases(){
    this.useCaseId.forEach(id => {
      this._dataService.getUseCase(id)
      .subscribe(res => {
        let json = res.json();
        this.useCases.push(json.data);
      });
    });
  }

  ngOnInit() {
  }

  onSelect(usecase: UseCase) {
    this.selectedUseCase = usecase;
  }

  submitNewUseCase(){
    var newUseCase = document.getElementById("useCaseForm");
    var object = new UseCase;
    console.log(newUseCase);
  }

}
