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
    var object = new UseCase();
    object.title = newUseCase.title.value;
    object.goal = newUseCase.goal.value;
    object.scope = newUseCase.scope.value;
    object.level = newUseCase.level.value;
    object.preconditions = newUseCase.preconditions.value;
    object.successEndCondition = newUseCase.successEndCondition.value;
    object.failedEndCondition = newUseCase.failedEndCondition.value;
    object.primaryActor = newUseCase.primaryActor.value;
    object.secondaryActors = newUseCase.secondaryActors.value;
    object.trigger = newUseCase.trigger.value;
    object.description
    console.log(this.projectID);
  }
  /*export class UseCase {
    _id: string;
    project: string; //ObjectID of the project
    title: string;
    goal: string;
    scope: string;
    level: string;
    preconditions: Array<string>;
    successEndCondition: string;
    failedEndCondition: string;
    primaryActor: string;
    secondaryActors: Array<string>;
    trigger: string;
    description: Array<string>;
    extensions: Array<string>;
    subVariations: Array<string>;
  }*/

}
