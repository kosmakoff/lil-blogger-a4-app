import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { User } from '../shared/models/user.model';
import { Profile } from '../shared/models/profile.model';

import { FirebaseService } from '../shared/services/firebase.service';

import { PromiseUtils } from '../shared/utilities/promiseUtils';

@Injectable()
export class AccountService {
    public currentUser: Observable<User>;

    constructor(private firebaseService: FirebaseService) {
        this.currentUser = this.firebaseService.currentFbUser
            .map((user) => this.fbUserToUser(user));
    }

    login(): Promise<User> {
        return this.firebaseService.login()
            .map(data => this.fbUserToUser(data.user))
            .toPromise();
    }

    logout(): Promise<any> {
        return this.firebaseService.logout()
            .toPromise();
    }

    async getProfile(uid: string): Promise<Profile> {
        const fbProfilePromise: firebase.Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`users/${uid}`).once('value');
        const profilePromise = PromiseUtils.fbPromiseToPromise(fbProfilePromise);

        const profileSnapshot = await profilePromise;
        const profile = profileSnapshot.val();
        return this.fbProfileToProfile(uid, profile);
    }

    private fbUserToUser(fbUser: firebase.UserInfo): User {
        if (fbUser === null) {
            return null;
        }

        const user = new User();

        user.uid = fbUser.uid;
        user.email = fbUser.email;
        user.displayName = fbUser.displayName;
        user.imageUrl = fbUser.photoURL;

        return user;
    }

    private fbProfileToProfile(uid: string, fbProfile: { photoURL: string, displayName: string } | null): Profile {
        if (fbProfile === null) {
            return null;
        }

        return {
            uid: uid,
            displayName: fbProfile.displayName,
            imageUrl: fbProfile.photoURL
        };
    }
}
