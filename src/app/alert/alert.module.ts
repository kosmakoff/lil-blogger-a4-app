import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './alert.component';

import { AlertService } from './alert.service';

@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    declarations: [
        AlertComponent
    ],
    providers: [
        AlertService
    ],
    exports: [
        AlertComponent
    ]
})
export class AlertModule { }
