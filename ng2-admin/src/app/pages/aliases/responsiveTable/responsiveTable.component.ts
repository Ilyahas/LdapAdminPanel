import {Component, OnInit} from '@angular/core';
import {ServerService} from '../../services/ServerService.service';

@Component({
  selector: 'responsive-table',
  templateUrl: './responsiveTable.html',
})
export class ResponsiveTable implements OnInit{

  constructor(private serverService: ServerService) {  }

  tableItems: any;
  delIndex: number;

  ngOnInit() {
    this.serverService.getUsers('getAliases').subscribe(users => {
      this.tableItems = users;
    });
  }

  saveIndexForDel(index) {
    this.delIndex = index;
  }

  delAlias() {
    const delAlias = this.tableItems.splice(this.delIndex, 1);
    this.serverService.modifyUser(delAlias[0].dn, 'delAlias').subscribe(res => {
      if (res.status === 200) {
        console.log('Alias was deleted');
        $('.hideModal').click();
      } else {
        console.log('Alias was not deleted');
      }
    });
  }

}
