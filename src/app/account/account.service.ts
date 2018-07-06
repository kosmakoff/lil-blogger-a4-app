import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { User } from '../shared/models/user.model';
import { Profile } from '../shared/models/profile.model';

import { FirebaseService } from '../shared/services/firebase.service';

@Injectable()
export class AccountService {
    public currentUser: Observable<User | null>;

    constructor(private firebaseService: FirebaseService) {
        this.currentUser = this.firebaseService.currentFbUser.pipe(
            map((user) => this.fbUserToUser(user))
        );
    }

    login(): Promise<User | null> {
        return this.firebaseService.login().pipe(
            map(data => this.fbUserToUser(data.user))
        ).toPromise();
    }

    logout(): Promise<any> {
        return this.firebaseService.logout()
            .toPromise();
    }

    async getProfile(uid: string): Promise<Profile | null> {
        const profilePromise: Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`users/${uid}`).once('value');

        const profileSnapshot = await profilePromise;
        const profile = profileSnapshot.val();
        return this.fbProfileToProfile(uid, profile);
    }

    private fbUserToUser(fbUser: firebase.UserInfo | null): User | null {
        if (fbUser === null) {
            return null;
        }

        const user: User = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Unidentified user',
            imageUrl: fbUser.photoURL
        };

        return user;
    }

    private fbProfileToProfile(uid: string, fbProfile: { photoURL: string, displayName: string } | null): Profile | null {
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
