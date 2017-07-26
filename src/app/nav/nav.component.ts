import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';

import { AccountService } from '../account/account.service';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs/Subscription';

declare const $: any;
// import * as $ from 'jquery';
// import 'bootstrap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy, AfterViewInit {
  public isAuthenticated = false;
  public currentUser: User = null;

  private isAuthenticatedSubscription: Subscription;
  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService, private zone: NgZone) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      // firebase activities are not detected properly by Angular
      // so we need to update binding variables in NgZone, explicitly
      this.zone.run(() => {
        console.log(`Got user = ${user}, is null = ${user === null}`);
        this.currentUser = user;
      });
    });
    this.isAuthenticatedSubscription = this.accountService.isAuthenticated.subscribe(a => {
      this.zone.run(() => {
        console.log(`Got isAuth = ${a}`);
        this.isAuthenticated = a;
      });
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.isAuthenticatedSubscription.unsubscribe();
  }

  login() {
    this.accountService.login().subscribe((user) => {
      console.log(`${user.username} has just logged in`);
    });
  }

  logout() {
    this.accountService.logout().subscribe(() => {
      console.log(`User has just logged out`);
    });
  }

  collapse() {
    $('#navbarToggleArea').collapse('hide');
  }
}
