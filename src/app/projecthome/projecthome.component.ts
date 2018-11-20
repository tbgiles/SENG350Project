import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { Project } from '../project';
import { Router } from '@angular/router'

@Component({
  selector: 'app-projecthome',
  templateUrl: './projecthome.component.html',
  styleUrls: ['./projecthome.component.css']
})
export class ProjectHomeComponent implements OnInit {

  projects: Array<Project>;
  selectedProject: Project;

  constructor(private _dataService: DataService, private router: Router) {
    console.log("Opening Project Home Page");
    this.selectedProject = null;
    this.getProjects();
  }

  ngOnInit() {
  }

  getProjects(): void {
    this._dataService.getProjects()
      .subscribe(res => {
        this.projects = res.json().data;
      });
  }

  onSelect(project: Project) {
    this.selectedProject = project;
  }

  createNewProject() {

    // this._modalService.open();
    // Create a modal here to fill in data
    // Submit filled in fields to DB

  }

  openProject(){
    let projectToOpen = this.selectedProject;
    sessionStorage.currentProject = projectToOpen._id;
    this.router.navigateByUrl(`/project/${this.selectedProject._id}`);
  }

}
