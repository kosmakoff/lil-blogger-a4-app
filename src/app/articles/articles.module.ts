import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArticlesRoutingModule } from './articles-routing.module';
import { AccountModule } from '../account/account.module';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { CommentEditorComponent } from './comment-editor/comment-editor.component';
import { CommentsSectionComponent } from './comments-section/comments-section.component';
import { CommentDetailsComponent } from './comment-details/comment-details.component';
import { DateLineComponent } from './date-line/date-line.component';

import { ArticlesService } from './articles.service';
import { DialogService } from '../shared/services/dialog.service';

import { MarkdownPipe } from './markdown.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { TimeSincePipe } from './time-since.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ArticlesRoutingModule,
        AccountModule
    ],
    declarations: [
        ArticleListComponent,
        ArticleDetailsComponent,
        ArticleEditorComponent,
        DateLineComponent,
        CommentEditorComponent,
        CommentsSectionComponent,
        CommentDetailsComponent,
        MarkdownPipe,
        EllipsisPipe,
        TimeSincePipe
    ],
    providers: [
        ArticlesService,
        DialogService
    ]
})
export class ArticlesModule { }
