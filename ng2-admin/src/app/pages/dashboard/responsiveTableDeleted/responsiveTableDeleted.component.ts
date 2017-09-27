import {Component, OnInit} from '@angular/core';
import {ServerService} from '../../services/ServerService.service';

@Component({
  selector: 'responsive-table-deleted',
  templateUrl: './responsiveTableDeleted.html',
})
export class ResponsiveTableDeleted implements OnInit{

  constructor(private serverService: ServerService) {  }

  tableItems: any;

  ngOnInit() {
    this.serverService.getUsers('getDeletedUsers').subscribe(users => {
      this.tableItems = users;
    });
  }

  activeUser(index) {
    const delUser = this.tableItems.splice(index, 1);
    this.serverService.modifyUser(delUser[0].dn, 'activeUser').subscribe(res => {
      if (res.status === 200) {
        console.log('User was activated');
      } else {
        console.log('User was not activated');
      }
    });
  }

}
