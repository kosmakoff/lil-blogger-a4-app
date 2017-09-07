import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Profile } from '../shared/models/profile.model';

import { AccountService } from '../account/account.service';

@Injectable()
export class AuthorResolver implements Resolve<Profile> {
    constructor(private accountService: AccountService) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Profile> {
        const uid = route.params.uid;
        const authorProfile = await this.accountService.getProfile(uid);
        return authorProfile;
    }
}
