import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';

import { environment } from '../../environments/environment';

const articlesRoutes: Routes = [
    { path: 'articles', component: ArticleListComponent },
    { path: 'article/:id', component: ArticleDetailsComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(articlesRoutes, {
            enableTracing: environment.enableTracing
        })
    ],
    exports: [
        RouterModule
    ]
})
export class ArticlesRoutingModule { }
