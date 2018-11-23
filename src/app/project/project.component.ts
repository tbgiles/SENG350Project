import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'
import { Project } from '../project';
import { UseCase } from '../usecase';
import { ProjectResolver } from './project-resolver.service';
import { map } from 'rxjs/operators';
import { response } from '../response';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project: Project;
  useCaseIds: Array<any>;
  useCases: Array<UseCase>;
  selectedUseCase: UseCase;
  projectID: any

  constructor(private _dataService: DataService, private router: Router, private actr: ActivatedRoute) {

    this.actr.data.subscribe(res => {
      this.projectID = res.project;
      this.retProjectInfo();
    });
  }


// TODO: Fix the usecase issue

  retProjectInfo(){
    this._dataService.getProject(this.projectID)
    .subscribe((res: response) => {
      this.project = res.data;
      this.useCaseIds = this.project.useCases;
      this.retProjectUseCases();
    });
  }

  retProjectUseCases(){
    this.useCaseIds.forEach(useCase => {
      this._dataService.getUseCase(useCase._id)
      .subscribe((res: response) => {
        this.useCases.push(res.data);
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
    object.project = this.projectID;
    object.title = newUseCase[0].value;
    object.goal = newUseCase[1].value;
    object.scope = newUseCase[2].value;
    object.level = newUseCase[3].value;
    object.preconditions = newUseCase[4].value;
    object.successEndCondition = newUseCase[5].value;
    object.failedEndCondition = newUseCase[6].value;
    object.primaryActor = newUseCase[7].value;
    object.secondaryActors = newUseCase[8].value;
    object.trigger = newUseCase[9].value;
    object.description = newUseCase[10].value;
    object.extensions = newUseCase[11].value;
    object.subVariations = newUseCase[12].value;
    this._dataService.submitUseCase(object);
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
