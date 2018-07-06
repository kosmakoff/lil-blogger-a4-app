
import { from as observableFrom, Observable, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';


import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { User } from '../models/user.model';

@Injectable()
export class FirebaseService {
    private app: firebase.app.App;
    public auth: firebase.auth.Auth;
    public database: firebase.database.Database;

    private currentFbUserSubject: Subject<firebase.UserInfo | null>;
    public currentFbUser: Observable<firebase.UserInfo | null>;

    constructor() {
        this.app = this.initializeApp();
        this.auth = this.app.auth();
        this.database = this.app.database();

        const currentUser = this.auth.currentUser || this.tryFetchUserFromStorage();

        this.currentFbUserSubject = new BehaviorSubject<firebase.UserInfo | null>(currentUser);
        this.currentFbUser = this.currentFbUserSubject.asObservable().pipe(
            distinctUntilChanged(this.compareUsers)
        );

        this.auth.onAuthStateChanged((user: firebase.User | null) => {
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
        return observableFrom(signInPromise);
    }

    logout(): Observable<void> {
        return observableFrom(this.auth.signOut());
    }

    private tryFetchUserFromStorage(): firebase.UserInfo | null {
        const keysCount = localStorage.length;
        let firebaseUserKey: string | null = null;
        for (let i = 0; i < keysCount; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('firebase:authUser')) {
                firebaseUserKey = key;
            }
        }

        // no key - no user
        if (!firebaseUserKey) {
            return null;
        }

        const userString = localStorage.getItem(firebaseUserKey);
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
