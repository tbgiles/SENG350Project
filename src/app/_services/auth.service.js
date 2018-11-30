"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var moment = require("moment");
var operators_1 = require("rxjs/operators");
var AuthService = /** @class */ (function () {
    function AuthService(_http) {
        this._http = _http;
    }
    AuthService.prototype.login = function (_id, name) {
        var _this = this;
        return this._http.post('/auth', { _id: _id, name: name })
            .pipe(operators_1.tap(function (res) { return _this.setSession(res); }), operators_1.shareReplay());
    };
    AuthService.prototype.setSession = function (authResult) {
        // Parse the result from the server
        var result = authResult;
        var expiresAt = moment().add(result.expiresIn, 'hour');
        // Store JWT and other details in local storage
        localStorage.setItem('idToken', result.idToken);
        localStorage.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()));
        localStorage.setItem('_id', result._id);
        localStorage.setItem('name', result.name);
    };
    // Clear out the browser's storage of all credentials.
    AuthService.prototype.logout = function () {
        localStorage.removeItem('idToken');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('_id');
        localStorage.removeItem('name');
    };
    AuthService.prototype.isLoggedIn = function () {
        return moment().isBefore(this.getExpiration());
    };
    AuthService.prototype.isLoggedOut = function () {
        return !this.isLoggedIn();
    };
    // Check credential expiration time, from browser's Storage.
    AuthService.prototype.getExpiration = function () {
        var expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
        return moment(expiresAt);
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
        /*
          This service has a lot of functionality, so be sure to poke around.
          It logs a user in after being passed a _id and name from the LoginComponent.
          It then passes this on to the '/auth' route definied in the root file 'server.js'.
          The server passes back a JWT, which we will later use for API-side authentication.
          For now, everything is stored in the browser's 'Storage', which keeps track of the
          user that is logged in, as well as how long their credentials are valid for (1 hour).
        
          This service also handles logging out, and a few other small functions.
        */
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
