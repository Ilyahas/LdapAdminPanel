import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../services/ServerService.service';

@Component({
  selector: 'basic-form',
  templateUrl: './basicForm.html',
  styleUrls: ['./basicForm.scss'],
})
export class BasicForm implements OnInit {

  newAddress = '';

  item = {
    sn: '',
    uid: '',
    givenName: '',
    homeDirectory: '',
    mailMessageStore: '',
    shadowAddress: [],
    userPassword: '',
    isChat: false,
    isGit: false,
    isPost: false,
    isFile: false,
  };
  warning = false;
  showMsg = false;
  message = 'Can\'t add user (fill all fields)';

  constructor(private serverService: ServerService,
              private router: Router,
  ) { }


  ngOnInit() {

  }

  submitForm() {
    console.log(this.isEmpty());
    if (!this.isEmpty()) {
      this.serverService.addUser(this.item).subscribe(
        res => {
          this.showMsg = false;
          this.router.navigate(['/pages/users']);
      }, err => {
          this.showMsg = true;
          this.message = err._body;
        });
    } else {
      this.showMsg = true;
    }
  }

  isEmpty() {
    return this.item.sn === '' || this.item.givenName === '' || this.item.uid === '' || this.item.userPassword === '';
  }

  addAddressLine() {
    if (this.newAddress !== '') {
      this.item.shadowAddress.push(this.newAddress);
      this.newAddress = '';
    }
  }

  removeAddressLine(index) {
    this.item.shadowAddress.splice(index, 1);
  }

  generateRandomPassword() {
    this.item.userPassword = Math.random().toString(36).slice(-8);
  }

}
