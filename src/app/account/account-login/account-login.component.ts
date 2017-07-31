import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../account.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.css']
})
export class AccountLoginComponent implements OnInit {
  public isBusy = false;

  constructor(private accountService: AccountService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
  }

  async login() {
    this.isBusy = true;
    try {
      const user = await this.accountService.login();
      const message = `${user.username} has just logged in`;
      this.alertService.success(message, true, 3000);
      this.router.navigate(['/articles']);
    } catch (error) {
      console.log(`Error, code='${error.code}', message='${error.message}'`);
      const message = `Failed to log in: ${error.message}`;
      this.alertService.error(message, true, 3000);
    }
    this.isBusy = false;
  }
}
