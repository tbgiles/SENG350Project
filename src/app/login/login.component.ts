import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users: Array<any>;
  selectedUser: User;
  @Output() logged = new EventEmitter();
  ngOnInit() {
  }

  constructor(private _dataService: DataService,
              private _authService: AuthService,
              private router: Router) {
    this.getUsers();
  }

  // Retrieve a list of all users from the database.
  getUsers(): void {
    this._dataService.getUsers()
      .subscribe(res => {
        this.users = res.json().data;
      });
  }

  // Function attached to the user buttons; allows selecting of a user.
  onSelect(user: User): void {
    this.selectedUser = user;
  }

  // Heavily tied to both AuthService and the root 'server.js' file.
  login() {
    this._authService.login(this.selectedUser._id, this.selectedUser.name)
      .subscribe( () => {
        console.log(`Successfully logged in as ${this.selectedUser.name}`);
        this.logged.emit(true);
        this.router.navigateByUrl('/');
      });
  }
}
