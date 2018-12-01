import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { response } from '../response';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: Array<User>;
  selectedUser: User

  constructor(private _dataService: DataService) {
    _dataService.getUsers()
      .subscribe((res: response) => {
        this.users = [];
        for(var i = 0; i < res.data.length;i++){
          if(res.data[i].name != "Admin"){
            this.users.push(res.data[i]);
          }
        }
      });
  }

  ngOnInit() {
  }

  onSelect(user: User){
    this.selectedUser = user;
  }

  createUser(){
    var newUser = document.getElementById("userCreateForm");

    var object = new User();
    object.name = newUser[0].value ?  newUser[0].value : "Untitled";
    object.role = "user"
    this._dataService.createUser(object);
  }

  updateUser(){
    var existingUser = document.getElementById("userEditForm");
    this.selectedUser.name = existingUser[0].value ?  existingUser[0].value : "Untitled";
    this._dataService.updateUser(this.selectedUser);
  }

  deleteUser(){
    this._dataService.deleteUser(this.selectedUser);
  }

}
