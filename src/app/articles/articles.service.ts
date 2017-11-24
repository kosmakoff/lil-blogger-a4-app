import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import * as firebase from 'firebase/app';

import { FirebaseService } from '../shared/services/firebase.service';
import { Article, FirebaseArticle } from '../shared/models/article.model';
import { Comment, FirebaseComment } from '../shared/models/comment.model';
import { Profile } from '../shared/models/profile.model';

@Injectable()
export class ArticlesService {
    constructor(private firebaseService: FirebaseService) {
    }

    async getArticles(limit: number = 10, startAt: number = 0, authorUid: string | null = null): Promise<Article[]> {
        const ref = authorUid ? `user-articles/${authorUid}` : 'articles';
        let query: firebase.database.Query = this.firebaseService.database.ref(ref).orderByChild('order');

        if (startAt !== 0) {
            query = query.startAt(startAt);
        }

        query = query.limitToFirst(limit);

        const fbArticles: firebase.database.DataSnapshot = await query.once('value');
        const fbArticlesSnapshot = fbArticles.val();

        if (!fbArticlesSnapshot) {
            return [];
        }

        // sort by time descending
        return Object.keys(fbArticlesSnapshot)
            .filter(key => fbArticlesSnapshot.hasOwnProperty(key))
            .map(key => this.parseFbArticle(key, fbArticlesSnapshot[key]))
            .sort((a: Article, b: Article) => b.createdAt - a.createdAt);
    }

    async getArticle(articleId: string): Promise<Article> {
        const fbArticleDataPromise: Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`articles/${articleId}`).once('value');
        const fbArticleSnapshot = await fbArticleDataPromise;
        const fbArticleData = fbArticleSnapshot.val();

        return this.parseFbArticle(articleId, fbArticleData);
    }

    async postArticle(
        articleData: {title: string; body: string; },
        user: Profile, slug: string | null, createdAt: number | null): Promise<Article> {
        let articleKey: string;
        if (slug) {
            articleKey = slug;
        } else {
            const newRef = this.firebaseService.database.ref().child('articles').push();
            if (newRef.key) {
                articleKey = newRef.key;
            } else {
                throw new Error('New article Key could not be generated');
            }
        }

        const fbArticle = this.createFbArticle(articleData, user, createdAt);
        await this.firebaseService.database.ref(`/articles/${articleKey}`).set(fbArticle);

        const article: Article = this.parseFbArticle(articleKey, fbArticle);
        return article;
    }

    async getComments(articleId: string, limit: number = 10, startAt: number = 0): Promise<Comment[]> {
        const ref = `article-comments/${articleId}`;
        let query: firebase.database.Query = this.firebaseService.database.ref(ref).orderByChild('order');

        if (startAt !== 0) {
            query = query.startAt(startAt);
        }

        query = query.limitToFirst(limit);

        const fbComments: firebase.database.DataSnapshot = await query.once('value');
        const fbCommentsSnapshot = fbComments.val();

        if (!fbCommentsSnapshot) {
            return [];
        }

        // sort by time ascending
        return Object.keys(fbCommentsSnapshot)
            .filter(key => fbCommentsSnapshot.hasOwnProperty(key))
            .map(key => this.parseFbComment(articleId, key, fbCommentsSnapshot[key]))
            .sort((a, b) => a.createdAt - b.createdAt);
    }

    async postComment(article: Article, user: Profile,
        commentData: {slug: string; text: string; }, createdAt: number | null): Promise<Comment> {
        let commentKey: string;
        if (commentData.slug) {
            commentKey = commentData.slug;
        } else {
            const newRef = this.firebaseService.database.ref().child(`article-comments/${article.slug}`).push();
            if (newRef.key) {
                commentKey = newRef.key;
            } else {
                throw new Error('New comment Key could not be generated');
            }
        }

        const fbComment = this.createFbComment(user, commentData.text, createdAt);
        await this.firebaseService.database.ref(`article-comments/${article.slug}/${commentKey}`).set(fbComment);

        const comment: Comment = this.parseFbComment(article.slug, commentKey, fbComment);
        return comment;
    }

    private createFbArticle(article: {title: string; body: string; }, user: Profile, createdAt: number | null): FirebaseArticle {
        const timestamp = Date.now();
        return {
            uid: user.uid,
            authorName: user.displayName,
            authorPhotoURL: user.imageUrl,
            title: article.title,
            body: article.body,
            createdAt: createdAt || timestamp,
            updatedAt: timestamp,
            order: -timestamp
        };
    }

    private parseFbArticle(slug: string, fbArticle: FirebaseArticle): Article {
        const authorProfile: Profile = {
            uid: fbArticle.uid,
            displayName: fbArticle.authorName,
            imageUrl: fbArticle.authorPhotoURL
        };

        const article: Article = {
            slug: slug,
            author: authorProfile,
            title: fbArticle.title,
            body: fbArticle.body,
            createdAt: fbArticle.createdAt,
            updatedAt: fbArticle.updatedAt,
            order: fbArticle.order
        };

        return article;
    }

    private createFbComment(user: Profile, commentText: string, createdAt: number | null): FirebaseComment {
        const timestamp = Date.now();

        return {
            uid: user.uid,
            authorName: user.displayName,
            authorPhotoURL: user.imageUrl,
            text: commentText,
            createdAt: createdAt || timestamp,
            updatedAt: timestamp,
            order: timestamp
        };
    }

    private parseFbComment(articleSlug: string, slug: string, fbComment: FirebaseComment): Comment {
        const authorProfile: Profile = {
            uid: fbComment.uid,
            displayName: fbComment.authorName,
            imageUrl: fbComment.authorPhotoURL
        };

        const comment: Comment = {
            articleSlug: articleSlug,
            slug: slug,
            author: authorProfile,
            text: fbComment.text,
            createdAt: fbComment.createdAt,
            updatedAt: fbComment.updatedAt,
            order: fbComment.order
        };

        return comment;
    }
}
