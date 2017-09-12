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
  public currentUser: User | null;

  public isBusy = false;

  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
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
    this.router.navigate(['/articles']);
  }
}
