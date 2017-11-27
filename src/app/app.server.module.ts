import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { LOCAL_STORAGE, DummyStorage } from './local-storage';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ModuleMapLoaderModule
    ],
    providers: [
        // Add universal-only providers here
        {
            provide: LOCAL_STORAGE,
            // useClass: DummyStorage,
            useFactory: () => {
                console.log('Requested dummyStorage');
                return new DummyStorage();
            }
        }
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule { }
