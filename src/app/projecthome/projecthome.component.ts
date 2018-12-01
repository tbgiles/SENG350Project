import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { Project } from '../project';
import { Router } from '@angular/router'
import { response } from '../response';
import * as _ from 'lodash';

@Component({
  selector: 'app-projecthome',
  templateUrl: './projecthome.component.html',
  styleUrls: ['./projecthome.component.css']
})
export class ProjectHomeComponent implements OnInit {

  users: Array<any>;
  projects: Array<Project>;
  selectedProject: Project;

  constructor(private _authService: AuthService, private _dataService: DataService, private router: Router) {
    this.selectedProject = null;
    this._dataService.getUsers()
      .subscribe((res: response) => {
        this.users = [];
        let currentLoggedIn = this._authService.getID();
        for(var i = 0; i < res.data.length; i++){
          if(res.data[i]._id != currentLoggedIn){
            this.users.push(res.data[i]);
          }
        }
      });
    this._dataService.getProjects()
      .subscribe((res: response) => {
        this.projects = res.data;
      });
  }

  ngOnInit() {
  }

  onSelect(project: Project) {
    this.selectedProject = project;
  }

  createProject() {
    const ProjectInfo = document.getElementById ("newProjectForm");
    let object = new Project();
    let arr = [];
    const table = (<HTMLTableElement>document.getElementById("permissionsTable")).rows;

    for (var i = 0; i < table.length-1; i++){
      const username = (<HTMLInputElement>document.getElementById ("user" + (i))).innerText;
      const readPriv = (<HTMLInputElement>document.getElementById ("read" + (i))).checked;
      const writePriv = (<HTMLInputElement>document.getElementById ("write" + (i))).checked;
      if (!writePriv && !readPriv) continue; // Nothing was ticked for this user.
      let permission = writePriv ? "write" : "read";
      let userID = '';
      this.users.forEach((user) => {
        if (user.name == username) {
          userID = user._id;
        }
      });
      if (userID == this._authService.getID()) continue; // We'll add our own ownership.
      arr.push ({
          "_id": userID,
          "permission": permission
      });
    }
    arr.push({
      "_id": this._authService.getID(),
      "permission": "owner"
    })

   object.title = ProjectInfo[0].value.length > 0 ? ProjectInfo[0].value : "Untitled";
   object.users = arr;
   object.useCases = [];
   this._dataService.createProject(object);
  }

  openProject(){
    let projectToOpen = this.selectedProject;
    sessionStorage.currentProject = projectToOpen._id;
    this.router.navigateByUrl(`/project/${this.selectedProject._id}`);
  }

}
