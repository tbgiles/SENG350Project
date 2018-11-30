import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { Project } from '../project';
import { Router } from '@angular/router'
import { response } from '../response';

@Component({
  selector: 'app-projecthome',
  templateUrl: './projecthome.component.html',
  styleUrls: ['./projecthome.component.css']
})
export class ProjectHomeComponent implements OnInit {

  users: Array<any>;
  projects: Array<Project>;
  selectedProject: Project;

  constructor(private _dataService: DataService, private router: Router) {
    this.selectedProject = null;
    this.getProjects();
    this.getUsers();
  }

  ngOnInit() {
  }

  getUsers(): void {
    this._dataService.getUsers()
      .subscribe((res: response) => {
        this.users = res.data;
      });
  }

  getProjects(): void {
    this._dataService.getProjects()
      .subscribe((res: response) => {
        this.projects = res.data;
      });
  }

  onSelect(project: Project) {
    this.selectedProject = project;
  }

  createProject() {

    const ProjectInfo = document.getElementById ("newProjectForm");
    let object = new Project();
    let arr = [];
    const table = (<HTMLTableElement>document.getElementById("myTable")).rows;

    for (var i = 1; i < table.length; i++){
      const user = table[i].cells[0].innerHTML;
      const readPriv = (<HTMLInputElement>document.getElementById ("read" + (i-1).toString())).checked;
      const writePriv = (<HTMLInputElement>document.getElementById ("write" + (i-1).toString())).checked;
      let permission = '';

      if (readPriv && writePriv){
        permission = "write";
      }else if (readPriv){
        permission = "read";
      }else if (writePriv){
        permission = "write";
      }

      if (permission === "read" || permission === "write"){
        arr.push ({
            "user": user,
            "permission": permission
        });
      }
    }

   object.title = ProjectInfo[0].value;
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
