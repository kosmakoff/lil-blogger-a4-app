import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { MarkdownPipe } from './markdown.pipe';

import { ArticlesService } from './articles.service';
import { DialogService } from '../shared/services/dialog.service';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleEditorComponent } from './article-editor/article-editor.component';

import { EllipsisPipe } from './ellipsis.pipe';
import { TimeSincePipe } from './time-since.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ArticlesRoutingModule
    ],
    declarations: [
        ArticleListComponent,
        ArticleDetailsComponent,
        MarkdownPipe,
        ArticleEditorComponent,
        EllipsisPipe,
        TimeSincePipe
    ],
    providers: [
        ArticlesService,
        DialogService
    ]
})
export class ArticlesModule { }
