import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/ServerService.service';
import { Md5 } from 'ts-md5/dist/md5';
import { Router } from '@angular/router';

@Component({
  selector: 'basic-form',
  styleUrls: ['./basicForm.scss'],
  templateUrl: './basicForm.html',
})
export class BasicForm implements OnInit {

  msg = '';
  showMsg = false;
  showMsgSuccess = false;

  user = {
    givenName: '',
    sn: '',
    userPassword: '',
  };
  checkPassword = {
    value1: '',
    value2: '',
    err: false,
  };

  picture: string;

  constructor(private serverService: ServerService, private router: Router) {
  }

  ngOnInit() {
    this.serverService.getUser().subscribe(user => {
       this.user = user;
       this.picture = 'https://www.gravatar.com/avatar/' + Md5.hashStr(user.mail) + '?s=200';
    }, err => {
      this.router.navigate(['/login']);
    });
  }

  submit() {
    this.showMsgSuccess = false;
    if (this.user.givenName.length === 0 || this.user.sn.length === 0) {
      this.msg = 'The name\'s field is empty!';
      this.showMsg = true;
    } else {
      this.showMsg = false;
      this.serverService.updateUser(this.user, 'updateData').subscribe(res => {
          this.showMsg = false;
          this.showMsgSuccess = true;
          this.msg = 'Data was updated!';
        },
        err => {
          this.msg = 'Can\'t update';
          this.showMsg = true;
        });
    }
  }

  submitPassword() {
    this.showMsgSuccess = false;
    if (this.checkPassword.value1 !== this.checkPassword.value2) {
      this.msg = 'Passwords does not match!';
      this.showMsg = true;
      this.checkPassword.err = true;
    } else if (this.checkPassword.value1.length < 6 || this.checkPassword.value2.length < 6) {
      this.msg = 'The password is too short!';
      this.showMsg = true;
      this.checkPassword.err = true;
    } else {
      this.showMsg = false;
      this.checkPassword.err = false;
      if (this.checkPassword.value1.length !== 0) {
        this.user.userPassword = this.checkPassword.value1;
      }
      this.serverService.updateUser(this.user, 'updateUserPassword').subscribe(res => {
          this.showMsg = false;
          this.showMsgSuccess = true;
          this.msg = 'Password was updated!';
          this.checkPassword.value1 = this.checkPassword.value2 = '';
        },
        err => {
          this.msg = 'Can\'t update password';
          this.showMsg = true;
        });
    }
  }

}
