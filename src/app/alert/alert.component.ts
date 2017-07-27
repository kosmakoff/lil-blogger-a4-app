import { Component, OnInit } from '@angular/core';

import { Alert, AlertType } from '../shared/models/alert.model';

import { AlertService } from './alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
    public alerts: Alert[] = [];

    constructor(private alertService: AlertService) { }

    ngOnInit(): void {
        this.alertService.getAlert().subscribe(alert => {
            if (!alert) {
                this.alerts = [];
                return;
            }

            // add alert to the list of currently shown alerts
            this.alerts.push(alert);

            // set timeout to hide it if set
            if (alert.timeout !== null) {
                setTimeout(() => {
                    this.removeAlert(alert);
                }, alert.timeout);
            }
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(a => a !== alert);
    }

    getAlertType(alertType: AlertType): string {
        switch (alertType) {
            case AlertType.Success:
                return 'success';
            case AlertType.Error:
                return 'danger';
            case AlertType.Info:
                return 'info';
            case AlertType.Warning:
                return 'warning';
            default:
                throw new Error(`Unknown Alert Type ${alertType}`);
        }
    }
}
