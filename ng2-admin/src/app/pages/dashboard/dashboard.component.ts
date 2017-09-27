import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
})
export class Dashboard {

  isShowHidden = 1;

  constructor(private router: Router) {
  }

  navAddUser() {
    this.router.navigate(['/pages/add-user']);
  }

  showHidden(booleanValue) {
    this.isShowHidden = booleanValue;
  }

}
