import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { User } from '../models/user.model';
import { LOCAL_STORAGE } from '../../local-storage';

@Injectable()
export class FirebaseService {
    private app: firebase.app.App;
    public auth: firebase.auth.Auth;
    public database: firebase.database.Database;

    private currentFbUserSubject: Subject<firebase.UserInfo | null>;
    public currentFbUser: Observable<firebase.UserInfo | null>;

    constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage) {
        this.app = this.initializeApp();
        this.auth = this.app.auth();
        this.database = this.app.database();

        const currentUser = this.auth.currentUser || this.tryFetchUserFromStorage();

        this.currentFbUserSubject = new BehaviorSubject<firebase.UserInfo | null>(currentUser);
        this.currentFbUser = this.currentFbUserSubject.asObservable().pipe(
            distinctUntilChanged(this.compareUsers)
        );

        this.auth.onAuthStateChanged((user: firebase.User) => {
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

    login(): Observable<firebase.auth.UserCredential> {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        const signInPromise: Promise<firebase.auth.UserCredential> = this.auth.signInWithPopup(googleProvider);
        return Observable.fromPromise(signInPromise);
    }

    logout(): Observable<void> {
        return Observable.fromPromise(this.auth.signOut());
    }

    private tryFetchUserFromStorage(): firebase.UserInfo | null {
        const keysCount = this.localStorage.length;
        let firebaseUserKey: string | null = null;
        for (let i = 0; i < keysCount; i++) {
            const key = this.localStorage.key(i);
            if (key && key.startsWith('firebase:authUser')) {
                firebaseUserKey = key;
            }
        }

        // no key - no user
        if (!firebaseUserKey) {
            return null;
        }

        const userString = this.localStorage.getItem(firebaseUserKey);
        if (!userString) {
            return null;
        }

        const userObject = JSON.parse(userString);

        return {
            displayName: userObject.displayName,
            email: userObject.email,
            photoURL: userObject.photoURL,
            providerId: 'google.com',
            uid: userObject.uid,
            phoneNumber: null
        };
    }

    private compareUsers(userA: firebase.UserInfo, userB: firebase.UserInfo): boolean {
        return !userA && !userB || userA && userB && userA.uid === userB.uid;
    }
}
