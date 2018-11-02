import { Component } from '@angular/core';
import { DataService } from './_services/data.service';
import { AuthService } from './_services/auth.service';
import { User } from './user'
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SENG350Project';
  users: Array<any>;
  selectedUser: User

  constructor() {
  }

}
