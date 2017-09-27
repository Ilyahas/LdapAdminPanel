import {Component, OnInit} from '@angular/core';
import {ServerService} from '../../services/ServerService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'responsive-table',
  templateUrl: './responsiveTable.html',
})
export class ResponsiveTable implements OnInit{

  constructor(private serverService: ServerService, private router: Router) {  }

  tableItems: any;

  ngOnInit() {
    this.serverService.getUsers('getUsers').subscribe(users => {
      if (users) {
        this.tableItems = users;
      }
    }, err => {
      this.router.navigate(['/login']);
    });
  }

  delUser(index) {
    const delUser = this.tableItems.splice(index, 1);
    this.serverService.modifyUser(delUser[0].dn, 'delUser').subscribe(res => {
      if (res.status === 200) {
        console.log('User was deleted');
        $('.hideModal').click();
      } else {
        console.log('User was not deleted');
      }
    });
  }

}
