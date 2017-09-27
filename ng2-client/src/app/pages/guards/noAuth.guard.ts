import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { ServerService } from '../services/ServerService.service';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  // Function to determine whether user is authorized to view route
  canActivate() {
    // Check if user is logged in
    if (ServerService.loggedIn()) {
      this.router.navigate(['/pages/users']); // Return error, route to home
      return false; // Return false: user not allowed to view route
    } else {
      return true; // Return true: user is allowed to view route
    }
  }
}
