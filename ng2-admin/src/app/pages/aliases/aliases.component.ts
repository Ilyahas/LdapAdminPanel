import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'aliases',
  styleUrls: ['./aliases.scss'],
  templateUrl: './aliases.html',
})
export class Aliases {

  constructor(private router: Router) {
  }

  navAddAliases() {
    this.router.navigate(['/pages/add-alias']);
  }

}
