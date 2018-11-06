import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';

/*
  This module is used when users are navigating throughout the website.
  You can see its declaration/use in 'app.module.ts', where you'll find it
  tied to many of the routes in the app. It essentially acts as a barrier
  that the user has to pass through, and if they're not logged in, it redirects
  them to the login page.

  TODO: make a similar guard file for admin-only pages.
*/
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private _authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authService.isLoggedIn()) {
        return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}
