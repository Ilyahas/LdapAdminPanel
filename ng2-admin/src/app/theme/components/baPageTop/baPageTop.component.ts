import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import {ServerService} from '../../../pages/services/ServerService.service';


@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;

  constructor(private _state:GlobalState, private serverService: ServerService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public downloadBackup() {
    this.serverService.getUsers('backup').subscribe(data => {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.toLdif(data)));
      element.setAttribute('download', 'Backup.ldif');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }

  toLdif(data) {
    let str = '';
    for (let i = 0; i < data.length; ++i) {
      if (data[i].cn) {
        str = str + 'cn: ' + data[i].cn + '\n';
      }
      if (data[i].dc) {
        str = str + 'dc: ' + data[i].dc + '\n';
      }
      if (data[i].accountStatus) {
        str = str + 'accountStatus: ' + data[i].accountStatus + '\n';
      }
      if (data[i].dn) {
        str = str + 'dn: ' + data[i].dn + '\n';
      }
      if (data[i].o) {
        str = str + 'o: ' + data[i].o + '\n';
      }
      if (data[i].objectClass) {
        if (typeof data[i].objectClass !== 'string') {
          for (let j = 0; j < data[i].objectClass.length; ++j) {
            str = str + 'objectClass: ' + data[i].objectClass[j] + '\n';
          }
        } else if (data[i].objectClass && typeof data[i].objectClass === 'string') {
          str = str + 'objectClass: ' + data[i].objectClass + '\n';
        }
      }
      if (data[i].shadowAddress) {
        if (typeof data[i].shadowAddress !== 'string') {
          for (let j = 0; j < data[i].shadowAddress.length; ++j) {
            str = str + 'shadowAddress: ' + data[i].shadowAddress[j] + '\n';
          }
        } else if (data[i].objectClass && typeof data[i].enabledService === 'string') {
          str = str + 'shadowAddress: ' + data[i].shadowAddress + '\n';
        }
      }
      if (data[i].enabledService) {
        if (typeof data[i].enabledService !== 'string') {
          for (let j = 0; j < data[i].enabledService.length; ++j) {
            str = str + 'enabledService: ' + data[i].enabledService[j] + '\n';
          }
        } else if (data[i].objectClass && typeof data[i].enabledService === 'string') {
          str = str + 'enabledService: ' + data[i].enabledService + '\n';
        }
      }
      if (data[i].mailForwardingAddress) {
        if (typeof data[i].mailForwardingAddress !== 'string') {
          for (let j = 0; j < data[i].mailForwardingAddress.length; ++j) {
            str = str + 'mailForwardingAddress: ' + data[i].mailForwardingAddress[j] + '\n';
          }
        } else if (data[i].objectClass && typeof data[i].mailForwardingAddress === 'string') {
          str = str + 'mailForwardingAddress: ' + data[i].mailForwardingAddress + '\n';
        }
      }
      if (data[i].givenName) {
        str = str + 'givenName: ' + data[i].givenName + '\n';
      }
      if (data[i].sn) {
        str = str + 'sn: ' + data[i].sn + '\n';
      }
      if (data[i].uid) {
        str = str + 'uid: ' + data[i].uid + '\n';
      }
      if (data[i].userPassword) {
        str = str + 'userPassword: ' + data[i].userPassword + '\n';
      }
      str += '\n';
    }
    return str;
  }



}
