import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';

import { UnsavedChangesGuard } from './article-editor/unsaved-changes-guard.service';
import { AuthGuard } from './article-editor/auth-guard.service';
import { ArticleDetailsResolver } from './article-details-resolver.service';

const articlesRoutes: Routes = [
    { path: 'articles', component: ArticleListComponent },
    {
        path: 'article/:id',
        component: ArticleDetailsComponent,
        resolve: {
            article: ArticleDetailsResolver
        }
    },
    {
        path: 'editor',
        component: ArticleEditorComponent,
        canDeactivate: [
            UnsavedChangesGuard
        ],
        canActivate: [
            AuthGuard
        ]
    },
    {
        path: 'editor/:id',
        component: ArticleEditorComponent,
        canDeactivate: [
            UnsavedChangesGuard
        ],
        resolve: {
            article: ArticleDetailsResolver
        },
        canActivate: [
            AuthGuard
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(articlesRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        UnsavedChangesGuard,
        AuthGuard,
        ArticleDetailsResolver
    ]
})
export class ArticlesRoutingModule { }
