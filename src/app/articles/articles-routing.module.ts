import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';

import { CanDeactivateEditor } from './article-editor/can-deactivate-editor-guard.service';

const articlesRoutes: Routes = [
    { path: 'articles', component: ArticleListComponent },
    { path: 'article/:id', component: ArticleDetailsComponent },
    {
        path: 'editor',
        component: ArticleEditorComponent,
        canDeactivate: [
            CanDeactivateEditor
        ]
    },
    { path: 'editor/:id', component: ArticleEditorComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(articlesRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        CanDeactivateEditor
    ]
})
export class ArticlesRoutingModule { }
