import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users: Array<any>;
  selectedUser: User
  ngOnInit() {
  }

  constructor(private _dataService: DataService) {
    this.getUsers();
  }

  // Retrieve a list of all users from the database
  getUsers(): void {
    this._dataService.getUsers()
      .subscribe(res => {
        this.users = res.json().data;
      });
  }

  onSelect(user: User): void {
    this.selectedUser = user;
  }
}
