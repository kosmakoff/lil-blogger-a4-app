import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ResolveStart, ResolveEnd } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AccountService } from './account/account.service';
import { AlertService } from './alert/alert.service';

import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private currentUserSubscription: Subscription;
  private routerEventsSubscription: Subscription;

  @ViewChild(NavComponent)
  private navComponent: NavComponent;

  public isLoading = false;

  constructor(private accountService: AccountService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      if (user) {
        const message = `${user.displayName} has just logged in`;
        this.alertService.success(message, true, 3000);
      } else {
        const message = 'You have just logged out';
        this.alertService.success(message, true, 3000);
      }
    });

    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof ResolveStart) {
        this.isLoading = true;
      }

      if (event instanceof ResolveEnd) {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.routerEventsSubscription.unsubscribe();
  }

  onPointerDown(event: PointerEvent) {
    this.navComponent.collapseNavBar();
  }
}
