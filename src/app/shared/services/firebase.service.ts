import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { User } from '../models/user.model';

@Injectable()
export class FirebaseService {
    private app: firebase.app.App;
    public auth: firebase.auth.Auth;

    private currentFbUserSubject = new BehaviorSubject<firebase.User>(null);
    public currentFbUser = this.currentFbUserSubject.asObservable().distinctUntilChanged();

    constructor() {
        this.app = this.initializeApp();
        this.auth = this.app.auth();

        this.auth.onAuthStateChanged((user: firebase.User) => {
            this.currentFbUserSubject.next(user);
        });
    }

    private initializeApp(): firebase.app.App {
        return firebase.initializeApp({
            apiKey: 'AIzaSyC7trcMDddXzPyFWqwQuQUYL1bBxmIDtQE',
            authDomain: 'lil-blogger.firebaseapp.com',
            databaseURL: 'https://lil-blogger.firebaseio.com/'
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
}
