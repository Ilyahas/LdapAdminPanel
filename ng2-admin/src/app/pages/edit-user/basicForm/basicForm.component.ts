import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/ServerService.service';

@Component({
  selector: 'basic-form',
  templateUrl: './basicForm.html',
  styleUrls: ['./basicForm.scss'],
})
export class BasicForm implements OnInit{

  newAddress = '';
  editAddressValue = '';
  savedIndex = 0;

  item = {
    dn: '',
    mail: '',
    uid: '',
    sn: '',
    givenName: '',
    enabledService: '',
    userPassword: '',
    shadowAddress: [],
    isChat: false,
    isGit: false,
    isPost: false,
    isFile: false,
  };
  checkPassword = {
    value1: '',
    value2: '',
    err: false,
  };

  getData = true;
  showMsg = false;
  message = 'User not found';

  constructor(private activatedRoute: ActivatedRoute,
              private serverService: ServerService,
              private router: Router,
  ) {
  }

  analyseBooleanData(data) {
    if (data) {
      if (data.indexOf('chat') !== -1) {
        this.item.isChat = true;
      }
      if (data.indexOf('git') !== -1) {
        this.item.isGit = true;
      }
      if (data.indexOf('mail') !== -1) {
        this.item.isPost = true;
      }
      if (data.indexOf('cloud') !== -1) {
        this.item.isFile = true;
      }
    }
  }

  removePostfix(data) {
    let tempArr = [];
    for (let i = 0; i < data.length; ++i) {
      if (data[i]) {
        const arr = data[i].split('@');
        tempArr[tempArr.length] = arr[0];
      }
    }
    return tempArr;
  }

  ngOnInit() {
    this.serverService.getUsers('getUsers').subscribe(users => {
      this.item = users[this.activatedRoute.snapshot.params.id];
      this.getData = this.item !== undefined;
      this.analyseBooleanData(this.item.enabledService);
      if (!Array.isArray(this.item.shadowAddress)) {
        this.item.shadowAddress = [users[this.activatedRoute.snapshot.params.id].shadowAddress];
      }
      if (this.item.shadowAddress === undefined) {
        this.item.shadowAddress = [];
      }
      this.item.shadowAddress = this.removePostfix(this.item.shadowAddress);
    });
  }

  submitForm() {
    if (!this.isEmpty()) {
      this.serverService.updateData(this.item).subscribe(res => {
        this.showMsg = false;
        this.router.navigate(['/pages/users']);
        },
          err => {
      this.message = 'Can\'t update';
      this.showMsg = true;
    });
    } else {
      this.showMsg = true;
      this.message = 'Fill all fields';
    }
  }

  isEmpty() {
    return this.item.dn === '' || this.item.givenName === '' || this.item.uid === '' || this.item.sn === '';
  }

  addAddressLine() {
    if (this.newAddress !== '') {
      this.item.shadowAddress[this.item.shadowAddress.length] = this.newAddress;
      this.newAddress = '';
    }
  }

  removeAddressLine(index) {
    this.item.shadowAddress.splice(index, 1);
  }

  editAddressLine(index) {
    this.savedIndex = index;
    this.editAddressValue = this.item.shadowAddress[index];
    $($('.template')[index]).removeClass('template-hide');
  }

  modifyAddressLine() {
    $($('.template')[this.savedIndex]).addClass('template-hide');
    this.item.shadowAddress[this.savedIndex] = this.editAddressValue;
  }

  submitFormPassword() {
    this.showMsg = false;
    if (this.checkPassword.value1 !== this.checkPassword.value2) {
      this.message = 'Passwords does not match!';
      this.showMsg = true;
      this.checkPassword.err = true;
    } else if (this.checkPassword.value1.length < 6 || this.checkPassword.value2.length < 6) {
      this.message = 'The password is too short!';
      this.showMsg = true;
      this.checkPassword.err = true;
    } else {
      this.showMsg = false;
      this.checkPassword.err = false;
      if (this.checkPassword.value1.length !== 0) {
        this.item.userPassword = this.checkPassword.value1;
      }
      this.serverService.updateUserPassword(this.item).subscribe(res => {
          this.showMsg = false;
          this.router.navigate(['/pages/users']);
        },
        err => {
          this.message = 'Can\'t update password';
          this.showMsg = true;
        });
    }
  }

}
