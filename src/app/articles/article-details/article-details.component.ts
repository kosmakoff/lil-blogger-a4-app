import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { ArticlesService } from '../articles.service';
import { Article } from '../../shared/models/article.model';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  public article: Article = null;

  private paramMapSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap
      .switchMap(async (params: ParamMap) => {
        const article = await this.articlesService.getArticle(params.get('id'));
        return article;
      })
      .subscribe(article => {
        this.article = article;
      });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription.unsubscribe();
  }
}
