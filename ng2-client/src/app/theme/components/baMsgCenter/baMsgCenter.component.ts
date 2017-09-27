import {Component} from '@angular/core';
import { Router } from '@angular/router';

import {BaMsgCenterService} from './baMsgCenter.service';
import {ServerService} from '../../../pages/services/ServerService.service'

@Component({
  selector: 'ba-msg-center',
  providers: [BaMsgCenterService],
  styleUrls: ['./baMsgCenter.scss'],
  templateUrl: './baMsgCenter.html'
})
export class BaMsgCenter {

  public notifications:Array<Object>;
  public messages:Array<Object>;

  constructor(private _baMsgCenterService:BaMsgCenterService, private router: Router) {
    this.notifications = this._baMsgCenterService.getNotifications();
    this.messages = this._baMsgCenterService.getMessages();
  }

  logout() {
    ServerService.unbindUser();
    this.router.navigate(['/login']);
  }

}
