import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/ServerService.service';

@Component({
  selector: 'basic-form',
  templateUrl: './basicForm.html',
  styleUrls: ['./basicForm.scss'],
})
export class BasicForm implements OnInit{

  users = [];
  newValue = '';

  item = {
    dn: '',
    mail: '',
    mailForwardingAddress: [],
  };
  getData = true;
  showMsg = false;
  message = 'Alias not found';

  constructor(private activatedRoute: ActivatedRoute,
              private serverService: ServerService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.serverService.getUsers('getAliases').subscribe(users => {
      this.item = users[this.activatedRoute.snapshot.params.id];
      this.getData = this.item !== undefined;
      if (this.item.mailForwardingAddress === undefined)
        this.item.mailForwardingAddress = [];
      if (typeof this.item.mailForwardingAddress === 'string') {
        this.item.mailForwardingAddress = [users[this.activatedRoute.snapshot.params.id].mailForwardingAddress];
      }
      this.serverService.getUsers('getUsers').subscribe(userss => {
        for (let i = 0; i < userss.length; ++i){
          this.users[this.users.length] = userss[i].mail;
        }
        for (let i = 0; i < this.item.mailForwardingAddress.length; ++i){
          const remIndex = this.users.indexOf(this.item.mailForwardingAddress[i]);
          if (remIndex !== -1){
            this.users.splice(remIndex, 1);
          }
        }
      });
    });
  }

  submitForm() {
    this.serverService.updateAlias(this.item).subscribe(res => {
      this.showMsg = false;
      this.router.navigate(['/pages/aliases']);
      },
      err => {
      this.message = 'Can\'t update';
      this.showMsg = true;
    });
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
