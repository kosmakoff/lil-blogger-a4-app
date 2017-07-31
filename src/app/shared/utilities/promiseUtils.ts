import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

export class PromiseUtils {
    static fbPromiseToPromise<T>(fbPromise: firebase.Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            fbPromise.then(v => {
                resolve(v);
            }).catch(e => {
                reject(e);
            });
        });
    }
}
