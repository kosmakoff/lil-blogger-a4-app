import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AccountService } from '../account.service';
import { AlertService } from '../../alert/alert.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-account-logout',
  templateUrl: './account-logout.component.html',
  styleUrls: ['./account-logout.component.css']
})
export class AccountLogoutComponent implements OnInit, OnDestroy {
  public currentUser: User;

  public isBusy = false;

  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    console.log(`Account.Logout - NgOninit`);
    // debugger;
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      console.log('Subscription worked');
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  async logout() {
    this.isBusy = true;
    await this.accountService.logout();
    this.isBusy = false;
    const message = `You have just logged out`;
    this.alertService.success(message, true, 3000);
    this.router.navigate(['/articles']);
  }
}
