import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ArticlesService } from '../articles.service';
import { AccountService } from '../../account/account.service';
import { AlertService } from '../../alert/alert.service';

import { Article } from '../../shared/models/article.model';
import { Profile } from '../../shared/models/profile.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.css']
})
export class ArticleEditorComponent implements OnInit, OnDestroy {
  private currentUser: User;
  private currentUserSubscription: Subscription;

  public article: Article;
  constructor(private articlesService: ArticlesService,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router,
    private zone: NgZone) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.zone.run(() => {
        this.currentUser = user;
      });
    });

    this.clearInputs();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  async postArticle() {
    const newPostKey = await this.articlesService.postArticle(this.article, this.currentUser);
    this.alertService.info(`Article '${this.article.title}' was saved`, true, 1500);
    this.router.navigate(['/article/', newPostKey]);
  }

  private clearInputs() {
    this.article = new Article();

    this.article.title = '';
    this.article.body = '';
  }
}