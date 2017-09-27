import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import {ServerService} from '../../../pages/services/ServerService.service'

@Component({
  selector: 'ba-content-top',
  styleUrls: ['./baContentTop.scss'],
  templateUrl: './baContentTop.html',
})
export class BaContentTop {

  public activePageTitle:string = '';

  constructor(private _state:GlobalState, private serverService: ServerService) {
    this.serverService.getUser().subscribe(user => {
      this.activePageTitle = user.mail;
    });

  }
}
