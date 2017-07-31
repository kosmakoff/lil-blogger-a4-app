import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

import { ArticlesService } from '../articles.service';
import { AccountService } from '../../account/account.service';
import { AlertService } from '../../alert/alert.service';

import { Article } from '../../shared/models/article.model';
import { Profile } from '../../shared/models/profile.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  private currentUser: User;
  private currentUserSubscription: Subscription;

  public newArticle: Article;

  constructor(private articlesService: ArticlesService, private accountService: AccountService,
    private alertService: AlertService, private zone: NgZone) {
    // this.articlesService.getArticles().take(1).subscribe(articles => {
    //   console.log(`Got ${articles.length} articles from firebase DB`);
    // });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
