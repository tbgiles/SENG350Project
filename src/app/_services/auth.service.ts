import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: Http) { }
  login(username: string) {
    return this._http.post('/api/auth', {username})
  }
}
