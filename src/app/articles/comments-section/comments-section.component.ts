import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';

import { Article } from '../../shared/models/article.model';
import { Comment } from '../../shared/models/comment.model';
import { User } from '../../shared/models/user.model';

import { ArticlesService } from '../articles.service';
import { AccountService } from '../../account/account.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.css']
})
export class CommentsSectionComponent implements OnInit, OnDestroy {
  @Input() article: Article;

  public currentUser: User | null;
  private currentUserSubscription: Subscription;

  public comments: Comment[] = [];
  public isLoading = false;

  constructor(private articlesService: ArticlesService, private accountService: AccountService, private zone: NgZone) { }

  async ngOnInit(): Promise<void> {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.zone.run(() => {
        this.currentUser = user;
      });
    });

    this.isLoading = true;
    this.comments = await this.articlesService.getComments(this.article.slug);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  onCommentAdded(comment: Comment) {
    this.comments.push(comment);
  }
}
