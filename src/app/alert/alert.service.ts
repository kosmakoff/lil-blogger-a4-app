import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Alert, AlertType } from '../shared/models/alert.model';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    this.keepAfterRouteChange = false;
                } else {
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<Alert> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false, timeout: number | null = null) {
        this.alert(AlertType.Success, message, keepAfterRouteChange, timeout);
    }

    error(message: string, keepAfterRouteChange = false, timeout: number | null = null) {
        this.alert(AlertType.Error, message, keepAfterRouteChange, timeout);
    }

    info(message: string, keepAfterRouteChange = false, timeout: number | null = null) {
        this.alert(AlertType.Info, message, keepAfterRouteChange, timeout);
    }

    warn(message: string, keepAfterRouteChange = false, timeout: number | null = null) {
        this.alert(AlertType.Warning, message, keepAfterRouteChange, timeout);
    }

    alert(type: AlertType, message: string, keepAfterRouteChange = false, timeout: number | null = null) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: type, message: message, timeout: timeout });
    }

    clear() {
        // clear alerts
        this.subject.next();
    }
}
