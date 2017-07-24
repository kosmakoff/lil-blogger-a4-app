import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';

import { ArticlesService } from './articles.service';

import { ArticlesRoutingModule } from './articles-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ArticlesRoutingModule
    ],
    declarations: [
        ArticleListComponent,
        ArticleDetailsComponent
    ],
    providers: [
        ArticlesService
    ]
})
export class ArticlesModule { }
