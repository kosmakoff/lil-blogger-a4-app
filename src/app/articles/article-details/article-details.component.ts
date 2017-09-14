import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { Article } from '../../shared/models/article.model';
import { User } from '../../shared/models/user.model';

import { ArticlesService } from '../articles.service';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  public currentUser: User | null = null;
  public article: Article | null = null;

  private currentUserSubscription: Subscription;
  private routeDataSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private articlesService: ArticlesService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.routeDataSubscription = this.route.data.subscribe((data: { article: Article }) => {
      this.article = data.article;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.routeDataSubscription.unsubscribe();
  }
}
