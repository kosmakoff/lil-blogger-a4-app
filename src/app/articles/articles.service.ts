import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';

import * as firebase from 'firebase/app';

import { FirebaseService } from '../shared/services/firebase.service';
import { Article } from '../shared/models/article.model';
import { Comment } from '../shared/models/comment.model';
import { Profile } from '../shared/models/profile.model';

import { PromiseUtils } from '../shared/utilities/promiseUtils';

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

        const valuesPromise: firebase.Promise<firebase.database.DataSnapshot> = query.once('value');
        const fbArticles = await PromiseUtils.fbPromiseToPromise(valuesPromise);
        const fbArticlesSnapshot = fbArticles.val();

        if (!fbArticlesSnapshot) {
            return [];
        }

        return Object.keys(fbArticlesSnapshot)
            .filter(key => fbArticlesSnapshot.hasOwnProperty(key))
            .map(key => this.parseFbArticle(key, fbArticlesSnapshot[key]))
            .sort((a: Article, b: Article) => b.createdAt - a.createdAt);
    }

    async getArticle(articleId: string): Promise<Article> {
        const fbArticleDataPromise: firebase.Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`articles/${articleId}`).once('value');
        const fbArticleSnapshot = await PromiseUtils.fbPromiseToPromise(fbArticleDataPromise);
        const fbArticleData = fbArticleSnapshot.val();

        return this.parseFbArticle(articleId, fbArticleData);
    }

    async postArticle(
        article: {title: string; body: string; },
        user: Profile, slug: string | null, createdAt: number | null): Promise<string> {
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

        const fbArticle = this.createFbArticle(article, user, createdAt);
        const fbSetPromise = this.firebaseService.database.ref(`/articles/${articleKey}`).set(fbArticle);

        await PromiseUtils.fbPromiseToPromise(fbSetPromise);
        return articleKey;
    }

    async getComments(limit: number = 10, startAt: number = 0, articleId: string): Promise<Comment[]> {
        const ref = `article-comments/${articleId}`;
        let query: firebase.database.Query = this.firebaseService.database.ref(ref).orderByChild('order');

        if (startAt !== 0) {
            query = query.startAt(startAt);
        }

        query = query.limitToFirst(limit);

        const valuesPromise: firebase.Promise<firebase.database.DataSnapshot> = query.once('value');
        const fbComments = await PromiseUtils.fbPromiseToPromise(valuesPromise);
        const fbCommentsSnapshot = fbComments.val();

        if (!fbCommentsSnapshot) {
            return [];
        }

        return Object.keys(fbCommentsSnapshot)
            .filter(key => fbCommentsSnapshot.hasOwnProperty(key))
            .map(key => this.parseFbComment(key, fbCommentsSnapshot[key]))
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    async postComment(article: Article, user: Profile, comment: Comment): Promise<string> {
        let commentKey: string;
        if (comment.slug) {
            commentKey = comment.slug;
        } else {
            const newRef = this.firebaseService.database.ref().child(`article-comments/${article.slug}`).push();
            if (newRef.key) {
                commentKey = newRef.key;
            } else {
                throw new Error('New comment Key could not be generated');
            }
        }

        const fbComment = this.createFbComment(article, user, comment);
        const fbSetPromise = this.firebaseService.database.ref(`article-comments/${article.slug}/${commentKey}`).set(fbComment);

        await PromiseUtils.fbPromiseToPromise(fbSetPromise);
        return commentKey;
    }

    private createFbArticle(article: {title: string; body: string; }, user: Profile, createdAt: number | null): any {
        const timestamp = Date.now();
        return {
            uid: user.uid,
            createdAt: createdAt || timestamp,
            updatedAt: timestamp,
            order: -timestamp,
            title: article.title,
            body: article.body,
            authorName: user.displayName,
            authorPhotoURL: user.imageUrl
        };
    }

    private parseFbArticle(slug: string, fbArticle: any): Article {
        const authorProfile: Profile = {
            uid: fbArticle.uid,
            displayName: fbArticle.authorName,
            imageUrl: fbArticle.authorPhotoURL
        };

        const article: Article = {
            slug: slug,
            title: fbArticle.title,
            body: fbArticle.body,
            createdAt: fbArticle.createdAt,
            updatedAt: fbArticle.updatedAt,
            order: fbArticle.order,
            author: authorProfile
        };

        return article;
    }

    private createFbComment(article: Article, user: Profile, comment: Comment): any {
        const timestamp = Date.now();
        throw new Error();
        /*
        return {

        };
        */
    }

    private parseFbComment(slug: string, fbComment: any): Comment {
        const comment = new Comment();

        throw new Error();
        // TODO: implement field setting

        // return comment;
    }
}
