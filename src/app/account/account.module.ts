import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';

import { AccountService } from './account.service';

import { AccountRoutingModule } from './account-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AccountRoutingModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        AccountService
    ]
})
export class AccountModule { }
