import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AccountService } from '../account/account.service';
import { AlertService } from '../alert/alert.service';

import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  public isCollapsed = true;

  public currentUser: User = null;

  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService, private alertService: AlertService, private zone: NgZone) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      // firebase activities are not detected properly by Angular
      // so we need to update binding variables in NgZone, explicitly
      this.zone.run(() => {
        this.currentUser = user;
      });
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  toggleNavBar() {
    this.isCollapsed = !this.isCollapsed;
  }

  collapseNavBar() {
    this.isCollapsed = true;
  }
}
