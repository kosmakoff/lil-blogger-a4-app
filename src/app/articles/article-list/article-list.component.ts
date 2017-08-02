import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesService } from '../articles.service';

import { Article } from '../../shared/models/article.model';
import { Profile } from '../../shared/models/profile.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  public articles: Article[];

  constructor(private articlesService: ArticlesService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.articles = await this.articlesService.getArticles();
  }

  ngOnDestroy(): void {
  }

  viewArticle(article: Article): void {
    this.router.navigate(['/article', article.slug]);
  }
}
