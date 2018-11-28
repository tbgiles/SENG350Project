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
      this.useCases = new Array();
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

  populateData(){
    var oldUseCase = document.getElementById("existingUseCaseForm");
    oldUseCase[0].value = this.selectedUseCase.title;
    oldUseCase[1].value = this.selectedUseCase.goal;
    oldUseCase[2].value = this.selectedUseCase.scope;
    oldUseCase[3].value = this.selectedUseCase.level;
    oldUseCase[4].value = this.selectedUseCase.preconditions;
    oldUseCase[5].value = this.selectedUseCase.successEndCondition;
    oldUseCase[6].value = this.selectedUseCase.failedEndCondition;
    oldUseCase[7].value = this.selectedUseCase.primaryActor;
    oldUseCase[8].value = this.selectedUseCase.secondaryActors;
    oldUseCase[9].value = this.selectedUseCase.trigger;
    oldUseCase[10].value = this.selectedUseCase.description;
    oldUseCase[11].value = this.selectedUseCase.extensions;
    oldUseCase[12].value = this.selectedUseCase.subVariations;
  }

  submitNewUseCase(){
    var newUseCase = document.getElementById("useCaseForm");

    var object = new UseCase();
    object.project = this.projectID;
    object.title = newUseCase[0].value ?  newUseCase[0].value : "Untitled";
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

  submitOldUseCase(){
    var oldUseCase = document.getElementById("existingUseCaseForm");

    var object = new UseCase();
    object._id = this.selectedUseCase._id;
    object.project = this.projectID;
    object.title = oldUseCase[0].value ?  oldUseCase[0].value : "Untitled";
    object.goal = oldUseCase[1].value;
    object.scope = oldUseCase[2].value;
    object.level = oldUseCase[3].value;
    object.preconditions = oldUseCase[4].value;
    object.successEndCondition = oldUseCase[5].value;
    object.failedEndCondition = oldUseCase[6].value;
    object.primaryActor = oldUseCase[7].value;
    object.secondaryActors = oldUseCase[8].value;
    object.trigger = oldUseCase[9].value;
    object.description = oldUseCase[10].value;
    object.extensions = oldUseCase[11].value;
    object.subVariations = oldUseCase[12].value;
    this._dataService.updateUseCase(object);
  }
}
