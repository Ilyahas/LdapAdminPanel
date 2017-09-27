import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { port, prefClient, domainName, postDomain } from '../../../../../env';

@Injectable()
export class ServerService {

  constructor(public http: Http) { }

  host = window.location.protocol + '//' + window.location.hostname + port + prefClient;
  opt: any;

  userMail = '';

  bindUser(user) {
    let headers = new Headers({'Access-Control-Allow-Origin' : '*', 'Content-Type' : 'application/json' });
    let options = new RequestOptions({ headers: headers });

    localStorage.setItem('user', user.username);
    this.userMail = user.username;
    user.username = `mail=${user.username}@freshcode.org,ou=Users,
      domainName=${domainName}.${postDomain},o=domains,dc=${domainName},dc=${postDomain}`;
    return this.http.post(this.host + 'login', user, options);
  }

  static unbindUser() {
    localStorage.clear();
  }

  static getUserMail() {
    return localStorage.getItem('user');
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', this.userMail);
  }

  /**-----before send request to the server-------**/
  authHeader() {
    let token = localStorage.getItem('token');
    this.opt = new RequestOptions({
      headers: new Headers({
        'Access-Control-Allow-Origin' : '*',
        'Content-Type' : 'application/json',
        'authorization': token,
      })
    });
  }

  /** USERS **/

  getUser() {
    this.authHeader();
    let userMail = localStorage.getItem('user');
    return this.http.post(this.host + 'getUser',{ user: userMail }, this.opt).map(res => res.json()).catch((err) => {
      localStorage.clear();
      return Observable.throw(err);
    });
  }

  static loggedIn() {
    return tokenNotExpired() && localStorage.getItem('user');
  }

  updateUser(user, link) {
    this.authHeader();
    return this.http.post(this.host + link, user, this.opt);
  }

}
