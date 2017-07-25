import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';

import { environment } from '../environments/environment';

const appRoutes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: '/articles', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: environment.enableTracing
            }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
