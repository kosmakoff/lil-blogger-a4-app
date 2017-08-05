import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AccountService } from './account/account.service';
import { AlertService } from './alert/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      if (user) {
        const message = `${user.displayName} has just logged in`;
        this.alertService.success(message, true, 3000);
      } else {
        const message = `You have just logged out`;
        this.alertService.success(message, true, 3000);
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }
}
