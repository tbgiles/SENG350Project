import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/*
  This service has a lot of functionality, so be sure to poke around.
  It logs a user in after being passed a userId and name from the LoginComponent.
  It then passes this on to the '/auth' route definied in the root file 'server.js'.
  The server passes back a JWT, which we will later use for API-side authentication.
  For now, everything is stored in the browser's 'Storage', which keeps track of the
  user that is logged in, as well as how long their credentials are valid for (1 hour).

  This service also handles logging out, and a few other small functions.
*/
export class AuthService {

  key: string;

  constructor(private _http: Http) {
    this._http.get('/authpub',)
      .subscribe((res) => {
        this.key = res.json().data
      })
  }

  login(userId: number, name: string) {
    return this._http.post('/auth', {userId, name})
      .pipe(tap(res => this.setSession(res)) , shareReplay());
  }

  private setSession(authResult) {
    // Parse the result from the server
    const result = authResult.json();
    const expiresAt = moment().add(result.expiresIn,'hour');
    // Store JWT and other details in local storage
    localStorage.setItem('idToken', result.idToken);
    localStorage.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('userId', result.userId)
    localStorage.setItem('name', result.name)
  }

  // Clear out the browser's storage of all credentials.
  logout() {
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  // Check credential expiration time, from browser's Storage.
  getExpiration() {
    const expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
    return moment(expiresAt);
  }

}
