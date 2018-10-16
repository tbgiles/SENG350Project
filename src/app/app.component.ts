import { Component } from '@angular/core';
import { DataService } from './data.service';
import { User } from './user'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SENG350Project';
  users: Array<any>;
  selectedUser: User

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
