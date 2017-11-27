import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertModule } from './alert/alert.module';
import { AccountModule } from './account/account.module';
import { ArticlesModule } from './articles/articles.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LOCAL_STORAGE } from './local-storage';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    AboutComponent,
    PageNotFoundComponent
  ],
  imports: [
    NgbModule.forRoot(),
    AlertModule,
    BrowserModule.withServerTransition({ appId: 'lil-blogger-a4-app' }),
    FormsModule,
    AccountModule,
    ArticlesModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCAL_STORAGE,
      // useValue: window.localStorage,
      useFactory: () => {
        console.log('Requested real window.localStorage');
        return window.localStorage;
      }
    }
  ]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
