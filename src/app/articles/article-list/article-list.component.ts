import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ArticlesService } from '../articles.service';

import { Article } from '../../shared/models/article.model';
import { Profile } from '../../shared/models/profile.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  private articlesStartAt = 0;
  public hasMoreArticles = false;
  public articles: Article[];
  public isLoading = false;

  public authorProfile: Profile;

  private routeDataSubscription: Subscription;

  constructor(private articlesService: ArticlesService, private router: Router, private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    this.articles = [];

    this.routeDataSubscription = this.route.data.subscribe(async (data: {author: Profile | null}) => {
      this.authorProfile = data.author || null;
      await this.loadNextBatchOfArticles();
    });
  }

  ngOnDestroy(): void {
    this.routeDataSubscription.unsubscribe();
  }

  async loadNextBatchOfArticles(): Promise<void> {
    this.isLoading = true;
    const articles = await this.articlesService.getArticles(11, this.articlesStartAt);
    if (articles.length > 10) {
      this.articlesStartAt = articles[10].order;
      this.hasMoreArticles = true;
    } else {
      this.hasMoreArticles = false;
    }

    articles.slice(0, 10).forEach(article => {
      this.articles.push(article);
    });

    this.isLoading = false;
  }

  viewArticle(article: Article): void {
    this.router.navigate(['/article', article.slug]);
  }

  async onLoadMoreClicked() {
    await this.loadNextBatchOfArticles();
  }
}
