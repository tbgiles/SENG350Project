"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var project_1 = require("../project");
var ProjectHomeComponent = /** @class */ (function () {
    function ProjectHomeComponent(_dataService, router) {
        this._dataService = _dataService;
        this.router = router;
        console.log("Opening Project Home Page");
        this.selectedProject = null;
        this.getProjects();
        this.getUsers();
    }
    ProjectHomeComponent.prototype.ngOnInit = function () {
    };
    // Retrieve a list of all users from the database.
    ProjectHomeComponent.prototype.getUsers = function () {
        var _this = this;
        this._dataService.getUsers()
            .subscribe(function (res) {
            _this.users = res.data;
        });
    };
    // Function attached to the user buttons; allows selecting of a user.
    ProjectHomeComponent.prototype.onUserSelect = function (user) {
        this.selectedUser = user;
    };
    ProjectHomeComponent.prototype.getProjects = function () {
        var _this = this;
        this._dataService.getProjects()
            .subscribe(function (res) {
            _this.projects = res.data;
        });
    };
    ProjectHomeComponent.prototype.onProjectSelect = function (project) {
        this.selectedProject = project;
    };
    ProjectHomeComponent.prototype.createNewProject = function () {
        var userList = document.getElementById("myTable").rows;
        var readPriv = document.getElementById("read");
        var writePriv = document.getElementById("write");
        var object = new project_1.Project();
        for (var i = 1; i < userList.length; i++) {
            console.log(userList[0].innerHTML + "  ,  " + readPriv[i - 1].value + writePriv[i - 1].value);
        }
        // this._modalService.open();
        // Create a modal here to fill in data
        // Submit filled in fields to DB
    };
    ProjectHomeComponent.prototype.openProject = function () {
        var projectToOpen = this.selectedProject;
        sessionStorage.currentProject = projectToOpen._id;
        this.router.navigateByUrl("/project/" + this.selectedProject._id);
    };
    ProjectHomeComponent = __decorate([
        core_1.Component({
            selector: 'app-projecthome',
            templateUrl: './projecthome.component.html',
            styleUrls: ['./projecthome.component.css']
        })
    ], ProjectHomeComponent);
    return ProjectHomeComponent;
}());
exports.ProjectHomeComponent = ProjectHomeComponent;
