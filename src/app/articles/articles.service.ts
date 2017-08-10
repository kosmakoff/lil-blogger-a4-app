import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';

import * as firebase from 'firebase/app';

import { FirebaseService } from '../shared/services/firebase.service';
import { Article } from '../shared/models/article.model';
import { User } from '../shared/models/user.model';
import { Profile } from '../shared/models/profile.model';

import { PromiseUtils } from '../shared/utilities/promiseUtils';

@Injectable()
export class ArticlesService {
    constructor(private firebaseService: FirebaseService) {
    }

    async getArticlesCount(): Promise<number> {
        const valuePromise: firebase.Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`counters/articles`).once('value');
        const countSnapshot = await PromiseUtils.fbPromiseToPromise(valuePromise);
        return countSnapshot.val();
    }

    async getArticles(limit: number = 10, startAt: number = 0): Promise<Article[]> {
        let query: firebase.database.Query = this.firebaseService.database.ref('articles')
            .orderByChild('order');

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

    async postArticle(article: Article, user: User): Promise<string> {
        let newArticleKey: string;
        if (article.slug) {
            newArticleKey = article.slug;
        } else {
            newArticleKey = this.firebaseService.database.ref().child('articles').push().key;
        }

        const fbArticle = this.createFbArticle(article, user);

        const updates = {};
        updates[`/articles/${newArticleKey}`] = fbArticle;

        // TODO: rewrite as server-side function
        /*
        updates[`/user-articles/${user.uid}/${newArticleKey}`] = {
            order: fbArticle.order
        };
        */
        const fbSetPromise = this.firebaseService.database.ref().update(updates);

        await PromiseUtils.fbPromiseToPromise(fbSetPromise);
        return newArticleKey;
    }

    private parseFbArticle(slug: string, fbArticle: any): Article {
        const article = new Article();

        article.slug = slug;
        article.title = fbArticle.title;
        article.body = fbArticle.body;
        article.createdAt = fbArticle.createdAt;
        article.updatedAt = fbArticle.updatedAt;
        article.order = fbArticle.order;

        const authorProfile = new Profile();
        authorProfile.uid = fbArticle.uid;
        authorProfile.displayName = fbArticle.authorName;

        article.author = authorProfile;

        return article;
    }

    private createFbArticle(article: Article, user: User): any {
        const timestamp = Date.now();
        return {
            uid: user.uid,
            createdAt: article.createdAt || timestamp,
            updatedAt: timestamp,
            order: -timestamp,
            title: article.title,
            body: article.body,
            authorName: user.displayName
        };
    }
}
