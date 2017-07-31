import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AccountService } from './account.service';

@Directive({
  selector: '[appAccountSignedin]'
})
export class AccountSignedinDirective implements OnInit, OnDestroy {
  public condition: boolean;

  private currentUserSubscription: Subscription;

  constructor(private accountService: AccountService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef) { }

    ngOnInit(): void {
      this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
        if (user && this.condition || !user && !this.condition) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainerRef.clear();
        }
      });
    }

    ngOnDestroy(): void {
      this.currentUserSubscription.unsubscribe();
    }

    @Input() set appAccountSignedin(condition: boolean) {
      this.condition = condition;
    }
}
