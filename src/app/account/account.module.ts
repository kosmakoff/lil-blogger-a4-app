import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccountService } from './account.service';
import { FirebaseService } from '../shared/services/firebase.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    providers: [
        FirebaseService,
        AccountService
    ]
})
export class AccountModule { }
