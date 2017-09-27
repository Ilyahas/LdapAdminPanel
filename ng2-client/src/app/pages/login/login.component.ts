import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/ServerService.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  message: string;
  msgClass: string;
  redirectLink: string;

  constructor(fb: FormBuilder,
              private serverService: ServerService,
              private router: Router,
              private authGuard: AuthGuard,
  ) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values:any): void {
    this.submitted = true;
    if (this.form.valid) {
      const user = {
        username: this.form.get('email').value,
        password: this.form.get('password').value,
      };

      this.serverService.bindUser(user).subscribe((info) => {
        if (!info.json().binded) {
          this.message = 'Wrong data! Try again.';
          this.msgClass = 'alert alert-danger msg';
        } else {
          this.serverService.storeUserData(info.json().token, info.json().username);
          setTimeout(() => {
            (this.redirectLink === undefined) ?
              this.router.navigate(['/page/user']) :
              this.router.navigate([this.redirectLink]);
          });
        }
      });
    }
  }

  ngOnInit() {
    if (this.authGuard.redirectUrl){
      this.redirectLink = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}
