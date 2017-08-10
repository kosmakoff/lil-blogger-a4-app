import { Component, Input } from '@angular/core';

import { Article } from '../../shared/models/article.model';

@Component({
  selector: 'app-article-date-line',
  templateUrl: './article-date-line.component.html',
  styleUrls: ['./article-date-line.component.css']
})
export class ArticleDateLineComponent {
    @Input() article: Article;
}
