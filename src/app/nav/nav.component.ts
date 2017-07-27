import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AccountService } from '../account/account.service';
import { AlertService } from '../alert/alert.service';

import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy, AfterViewInit {
  public isCollapsed = true;

  public currentUser: User = null;

  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService, private alertService: AlertService, private zone: NgZone) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      // firebase activities are not detected properly by Angular
      // so we need to update binding variables in NgZone, explicitly
      this.zone.run(() => {
        let message: string;
        if (user !== null) {
          message = `${user.username} has just logged in`;
          this.alertService.success(message, undefined, 1500);
        } else {
          message = `User has just logged out`;
          this.alertService.success(message, undefined, 1500);
        }
        this.currentUser = user;
      });
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  login() {
    this.accountService.login().subscribe((user) => {
      const message = `${user.username} has just logged in`;
      console.log(message);
    });
  }

  logout() {
    this.accountService.logout().subscribe(() => {
      const message = `User has just logged out`;
      console.log(message);
    });
  }

  toggleNavBar() {
    this.isCollapsed = !this.isCollapsed;
  }

  collapseNavBar() {
    this.isCollapsed = true;
  }
}
