import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

import { ArticleEditorComponent } from './article-editor.component';

import { AccountService } from '../../account/account.service';
import { AlertService } from '../../alert/alert.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountService, private alertService: AlertService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log('Auth guard');
        return this.accountService.currentUser.take(1)
            .do(user => {
                console.log('User', user);
                if (!user) {
                    console.log('Auth guard says - NO');
                    this.alertService.error('You should sign in to do that', true, 3000);
                    this.router.navigate(['/articles']);
                }
            })
            .map(user => !!user);
    }
}
