import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

import { ArticleEditorComponent } from './article-editor.component';

import { AccountService } from '../../account/account.service';
import { AlertService } from '../../alert/alert.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountService, private alertService: AlertService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.accountService.currentUser.pipe(
            take(1),
            tap(user => {
                if (!user) {
                    this.alertService.error('You should sign in to do that', true, 3000);
                    this.router.navigate(['/articles']);
                }
            }),
            map(user => !!user)
        );
    }
}
