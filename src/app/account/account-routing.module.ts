import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

const accountRoutes: Routes = [
    { path: 'login', component: LoginComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(accountRoutes, {enableTracing: true})
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }