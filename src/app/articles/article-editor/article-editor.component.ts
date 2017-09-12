import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class ArticleEditorComponent implements OnInit, OnDestroy {
  public currentUser: User | null;
  private currentUserSubscription: Subscription;

  public articleForm: FormGroup;

  public isNew = false;

  public isSaving = false;

  private articleSlug: string | null;
  private articleCreatedAt: number | null;

  constructor(private articlesService: ArticlesService,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.zone.run(() => {
        this.currentUser = user;
      });
    });

    this.route.data.subscribe((data: { article: Article }) => {
      const article = data.article;

      if (article) {
        if (this.currentUser && article.author.uid !== this.currentUser.uid) {
          this.alertService.error('You can\'t edit article written by someone else.', true, 3000);
          this.router.navigate(['/articles']);
          return;
        }

        this.isNew = false;
        this.articleSlug = article.slug;
        this.articleCreatedAt = article.createdAt;

        this.articleForm.reset({
          title: article.title,
          body: article.body
        });
      } else {
        this.isNew = true;
        this.articleSlug = null;
        this.articleCreatedAt = null;

        this.articleForm.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  createForm() {
    this.articleForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      body: ['', Validators.required]
    });
  }

  async postArticle() {
    if (!this.currentUser) {
      return;
    }
    this.isSaving = true;
    const article = this.prepareArticle();
    const newPostKey = await this.articlesService.postArticle(article, this.currentUser, this.articleSlug, this.articleCreatedAt);
    this.isSaving = false;

    // mark the form as "clean" so that CanDeactivate guard is not triggered
    this.articleForm.markAsPristine();

    if (this.isNew) {
      this.alertService.info(`Article '${article.title}' was created.`, true, 1500);
    } else {
      this.alertService.info(`Article '${article.title}' was updated.`, true, 1500);
    }

    this.router.navigate(['/article/', newPostKey]);
  }

  prepareArticle(): {title: string; body: string; } {
    const formModel = this.articleForm.value;

    return {
      title: formModel.title,
      body: formModel.body
    };
  }

  get title() {
    return this.articleForm.get('title');
  }

  get body() {
    return this.articleForm.get('body');
  }
}
