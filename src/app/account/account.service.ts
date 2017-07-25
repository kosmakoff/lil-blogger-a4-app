import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';

import { User } from '../shared/models/user.model';

import { FirebaseService } from '../shared/services/firebase.service';

@Injectable()
export class AccountService {
    private currentUserSubject: Subject<User>;
    public currentUser: Observable<User>;

    private isAuthenticatedSubject: Subject<boolean>;
    public isAuthenticated: Observable<boolean>;

    constructor(private firebaseService: FirebaseService) {
        const fbUser = this.firebaseService.currentFbUser
            .map((user) => this.fbUserToUser(user));

        this.currentUserSubject = new BehaviorSubject<User>(<User>null);
        this.currentUser = this.currentUserSubject.asObservable()
            .merge(fbUser)
            .distinctUntilChanged()
            .do((user) => this.setUser(user));

        this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
        this.isAuthenticated = this.isAuthenticatedSubject.asObservable().distinctUntilChanged();
    }

    private setUser(user: User) {
        if (user === null) {
            // logout
            this.currentUserSubject.next(<User>null);
            this.isAuthenticatedSubject.next(false);
        } else {
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
        }
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
