import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';

import { CanDeactivateEditor } from './article-editor/can-deactivate-editor-guard.service';
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
            CanDeactivateEditor
        ]
    },
    {
        path: 'editor/:id',
        component: ArticleEditorComponent,
        canDeactivate: [
            CanDeactivateEditor
        ],
        resolve: {
            article: ArticleDetailsResolver
        }
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
        CanDeactivateEditor,
        ArticleDetailsResolver
    ]
})
export class ArticlesRoutingModule { }
