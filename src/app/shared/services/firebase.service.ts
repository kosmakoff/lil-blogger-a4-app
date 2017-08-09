import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { User } from '../models/user.model';

@Injectable()
export class FirebaseService {
    private app: firebase.app.App;
    public auth: firebase.auth.Auth;
    public database: firebase.database.Database;

    private currentFbUserSubject: Subject<firebase.UserInfo>;
    public currentFbUser: Observable<firebase.UserInfo>;

    constructor() {
        this.app = this.initializeApp();
        this.auth = this.app.auth();
        this.database = this.app.database();

        const currentUser = this.auth.currentUser || this.tryFetchUserFromStorage();

        this.currentFbUserSubject = new BehaviorSubject<firebase.UserInfo>(currentUser);
        this.currentFbUser = this.currentFbUserSubject.asObservable()
            .distinctUntilChanged(this.compareUsers);

        this.auth.onAuthStateChanged((user: firebase.User) => {
            console.log('User changed', user);
            this.currentFbUserSubject.next(user);
        });
    }

    private initializeApp(): firebase.app.App {
        return firebase.initializeApp({
            apiKey: 'AIzaSyC7trcMDddXzPyFWqwQuQUYL1bBxmIDtQE',
            authDomain: 'lil-blogger.firebaseapp.com',
            databaseURL: 'https://lil-blogger.firebaseio.com'
        });
    }

    login(): Observable<any> {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        const signInPromise = this.auth.signInWithPopup(googleProvider);
        return Observable.fromPromise(signInPromise);
    }

    logout(): Observable<any> {
        return Observable.fromPromise(this.auth.signOut());
    }

    private tryFetchUserFromStorage(): firebase.UserInfo | null {
        const keysCount = localStorage.length;
        let firebaseUserKey: string = null;
        for (let i = 0; i < keysCount; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('firebase:authUser')) {
                firebaseUserKey = key;
            }
        }

        // no key - no user
        if (!firebaseUserKey) {
            return null;
        }

        const userString = localStorage.getItem(firebaseUserKey);
        const userObject = JSON.parse(userString);

        return {
            displayName: userObject.displayName,
            email: userObject.email,
            photoURL: userObject.photoURL,
            providerId: 'google.com',
            uid: userObject.uid
        };
    }

    private compareUsers(userA: firebase.UserInfo, userB: firebase.UserInfo): boolean {
        return !userA && !userB || userA && userB && userA.uid === userB.uid;
    }
}
