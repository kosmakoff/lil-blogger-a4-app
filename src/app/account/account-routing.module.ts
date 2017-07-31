import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountLogoutComponent } from './account-logout/account-logout.component';

const accountRoutes: Routes = [
    { path: 'login', component: AccountLoginComponent },
    { path: 'logout', component: AccountLogoutComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(accountRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
