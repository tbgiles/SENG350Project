import { Component } from '@angular/core';
import { DataService } from './_services/data.service';
import { AuthService } from './_services/auth.service';
import { User } from './user'
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'SENG350Project';
  users: Array<any>;
  currentUser: string

  constructor(private _authService: AuthService,
              private router: Router) {
    this.getCurrentUser()
  }

  // Checks if a user is logged in via AuthService
  getCurrentUser() {
    if (this._authService.isLoggedIn()) {
      this.currentUser = localStorage.getItem('name');
    }
  }

  // Function attached to the Log out button in the header
  logout() {
    this._authService.logout();
    this.currentUser = null;
    this.router.navigateByUrl('/login');
  }
}
