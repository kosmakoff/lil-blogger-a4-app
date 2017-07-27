import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';

import { User } from '../shared/models/user.model';

import { FirebaseService } from '../shared/services/firebase.service';

@Injectable()
export class AccountService {
    public currentUser: Observable<User>;

    constructor(private firebaseService: FirebaseService) {
        this.currentUser = this.firebaseService.currentFbUser
            .map((user) => this.fbUserToUser(user));
    }

    login(): Observable<User> {
        return this.firebaseService.login()
            .map(data => this.fbUserToUser(data.user));
    }

    logout(): Observable<any> {
        return this.firebaseService.logout();
    }

    private fbUserToUser(fbUser: firebase.User): User {
        if (fbUser === null) {
            return null;
        }

        const user = new User();

        user.uid = fbUser.uid;
        user.email = fbUser.email;
        user.username = fbUser.displayName;
        user.imageUrl = fbUser.photoURL;

        return user;
    }
}
