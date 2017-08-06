import { Component, OnInit, OnDestroy, OnChanges, NgZone, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
export class ArticleEditorComponent implements OnInit, OnDestroy, OnChanges {
  private currentUser: User;
  private currentUserSubscription: Subscription;

  public articleForm: FormGroup;
  @Input() public article: Article;

  constructor(private articlesService: ArticlesService,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder) {
    this.article = new Article();
    this.createForm();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.zone.run(() => {
        this.currentUser = user;
      });
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.articleForm.reset({
      title: this.article.title,
      body: this.article.body
    });
  }

  createForm() {
    this.articleForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      body: ['', Validators.required]
    });
  }

  async postArticle() {
    this.article = this.prepareArticle();
    const newPostKey = await this.articlesService.postArticle(this.article, this.currentUser);

    // mark the form as "clean" so that CanDeactivate guard is not triggered
    this.articleForm.markAsPristine();

    this.alertService.info(`Article '${this.article.title}' was saved`, true, 1500);
    this.router.navigate(['/article/', newPostKey]);
  }

  prepareArticle(): Article {
    const formModel = this.articleForm.value;

    const saveArticle: Article = new Article();

    saveArticle.title = formModel.title;
    saveArticle.body = formModel.body;

    return saveArticle;
  }

  get title() {
    return this.articleForm.get('title');
  }

  get body() {
    return this.articleForm.get('body');
  }
}
