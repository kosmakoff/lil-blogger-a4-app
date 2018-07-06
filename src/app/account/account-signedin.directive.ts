import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef, SimpleChanges } from '@angular/core';

import { Subscription } from 'rxjs';

import { AccountService } from './account.service';
import { User } from '../shared/models/user.model';

@Directive({
  selector: '[appAccountSignedin]'
})
export class AccountSignedinDirective implements OnInit, OnDestroy {
  private condition = false;
  private currentUser: { uid: string };

  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      if (user && this.condition && (!this.currentUser || user.uid === this.currentUser.uid) || !user && !this.condition) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  @Input() set appAccountSignedin(value: boolean) {
    this.condition = value;
  }
  @Input() set appAccountSignedinCurrentUser(value: { uid: string }) {
    this.currentUser = value;
  }
}
