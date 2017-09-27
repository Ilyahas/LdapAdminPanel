import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { port, prefAdmin } from '../../../../../env';

@Injectable()
export class ServerService {

  constructor(public http: Http) { }

  host = window.location.protocol + '//' + window.location.hostname + port + prefAdmin;
  opt: any;

  bindUser(user) {
    localStorage.clear();
    let headers = new Headers({'Access-Control-Allow-Origin' : '*', 'Content-Type' : 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.host + 'login', user, options);
  }

  static unbindUser() {
    localStorage.clear();
  }

  static storeUserData(token, user) {
    localStorage.setItem('token', token);
  }

  /**-----before send request to the server-------**/
  authHeader() {
    let token = localStorage.getItem('token');
    this.opt = new RequestOptions({
      headers: new Headers({
        'Access-Control-Allow-Origin' : '*',
        'Content-Type' : 'application/json',
        'authorization': token,
      }),
    });
  }

  /** USERS **/

  getUsers(path) {
    this.authHeader();
    return this.http.get(this.host + path, this.opt).map(res => res.json()).catch((err) => {
      localStorage.clear();
      return Observable.throw(err);
    });
  }

  static loggedIn() {
    return tokenNotExpired() && localStorage.getItem('user') === null;
  }

  updateData(data) {
    this.authHeader();
    return this.http.post(this.host + 'updateData', data, this.opt);
  }

  updateDataHiddenUser(data) {
    this.authHeader();
    return this.http.post(this.host + 'updateDataHiddenUser', data, this.opt);
  }

  addUser(data) {
    this.authHeader();
    return this.http.post(this.host + 'addUser', data, this.opt);
  }

  modifyUser(dn, action) {
    this.authHeader();
    return this.http.post(this.host + action, { dn: dn }, this.opt);
  }

  /** ALIASES **/

  addAlias(data) {
    this.authHeader();
    return this.http.post(this.host + 'addAlias', data, this.opt);
  }

  updateAlias(data) {
    this.authHeader();
    return this.http.post(this.host + 'updateAlias', data, this.opt);
  }

  updateUserPassword(item) {
    this.authHeader();
    return this.http.post(this.host + 'updateUserPassword', item, this.opt);
  }

}
