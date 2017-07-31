import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccountService } from './account.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountLogoutComponent } from './account-logout/account-logout.component';
import { AccountSignedinDirective } from './account-signedin.directive';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AccountRoutingModule
    ],
    providers: [
        FirebaseService,
        AccountService
    ],
    declarations: [
        AccountLoginComponent,
        AccountLogoutComponent,
        AccountSignedinDirective
    ],
    exports: [
        AccountSignedinDirective
    ]
})
export class AccountModule { }
