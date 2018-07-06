import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Article } from '../../shared/models/article.model';
import { User } from '../../shared/models/user.model';
import { Comment } from '../../shared/models/comment.model';

import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-comment-editor',
  templateUrl: './comment-editor.component.html',
  styleUrls: ['./comment-editor.component.css']
})
export class CommentEditorComponent implements OnInit {
  @Input() article: Article;
  @Input() user: User;
  @Output() onCommentAdded = new EventEmitter<Comment>();

  public isSending = false;

  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
  }

  async saveComment(event: Event, el: HTMLInputElement): Promise<void> {
    event.preventDefault();

    this.isSending = true;
    const commentText = el.value;

    const newComment = await this.articlesService.postComment(this.article, this.user, commentText);

    this.isSending = false;

    this.onCommentAdded.emit(newComment);

    el.value = '';
  }
}
