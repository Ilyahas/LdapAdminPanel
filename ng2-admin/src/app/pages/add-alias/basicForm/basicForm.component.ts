import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../services/ServerService.service';

@Component({
  selector: 'basic-form',
  templateUrl: './basicForm.html',
  styleUrls: ['./basicForm.scss'],
})
export class BasicForm implements OnInit {

  users = [];
  newValue = '';

  item = {
    uid: '',
    mailForwardingAddress: [],
  };
  showMsg = false;
  message = 'Can\'t add alias (wrong data)';

  constructor(private serverService: ServerService,
              private router: Router,
  ) { }


  ngOnInit() {
    this.serverService.getUsers('getUsers').subscribe(users => {
      for (let i = 0; i < users.length; ++i){
        this.users[this.users.length] = users[i].mail;
      }
    });
  }

  submitForm() {
    if (!this.isEmpty()) {
      this.serverService.addAlias(this.item).subscribe(
        res => {
          this.showMsg = false;
          this.router.navigate(['/pages/aliases']);
      }, err => {
          this.showMsg = true;
        });
    } else {
      this.showMsg = true;
    }
  }

  isEmpty() {
    return this.item.uid === '';
  }

  autocompleListFormatter = (data: any)  => {
    const html = `<span style='color:black !important;'>${data}</span>`;
    $('.ngui-auto-complete ul li').css('background-color', '#357DCA');
    $('.ngui-auto-complete ul li').hover(function() {
      $(this).css('background-color', '#3677C2');
    });
    return html;
  };

  addUser() {
    if (this.newValue !== '' && this.users.length !== 0 && this.users.indexOf(this.newValue) !== -1){
      this.item.mailForwardingAddress.push(this.newValue);
      this.users.splice(this.users.indexOf(this.newValue), 1);
      this.newValue = '';
    } else {
      this.newValue = '';
    }
  }

  removeUser(index) {
    const tempuser = this.item.mailForwardingAddress.splice(index, 1);
    this.users.push(tempuser[0]);
  }

}
