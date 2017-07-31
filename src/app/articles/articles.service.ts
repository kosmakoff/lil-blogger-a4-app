import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';

import * as firebase from 'firebase/app';

import { FirebaseService } from '../shared/services/firebase.service';
import { Article } from '../shared/models/article.model';
import { User } from '../shared/models/user.model';

import { PromiseUtils } from '../shared/utilities/promiseUtils';

@Injectable()
export class ArticlesService {
    constructor(private firebaseService: FirebaseService) {
    }

    async getArticles(): Promise<Article[]> {
        const valuesPromise: firebase.Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`articles`).once('value');
        const fbArticlesSnapshot = (await PromiseUtils.fbPromiseToPromise(valuesPromise)).val();
        debugger;
        return fbArticlesSnapshot.map(fbArticle => this.parseFbArticle(fbArticlesSnapshot));
    }

    async getArticle(articleId: string): Promise<Article> {
        const valuePromise: firebase.Promise<firebase.database.DataSnapshot> =
            this.firebaseService.database.ref(`articles/${articleId}`).once('value');
        const fbArticleSnapshot = (await PromiseUtils.fbPromiseToPromise(valuePromise)).val();
        return this.parseFbArticle(fbArticleSnapshot);
    }

    async postArticle(article: Article, user: User): Promise<string> {
        const newArticleKey = this.firebaseService.database.ref().child('articles').push().key;
        const fbArticle = this.createFbArticle(article, user);

        const updates = {};
        updates[`/articles/${newArticleKey}`] = fbArticle;
        // TODO: add user-articles
        // TODO: add whatever else is needed here

        const fbSetPromise = this.firebaseService.database.ref().update(updates);

        await PromiseUtils.fbPromiseToPromise(fbSetPromise);
        return newArticleKey;
    }

    private parseFbArticle(fbArticle: any): Article {
        const article = new Article();

        article.title = fbArticle.title;
        article.body = fbArticle.body;

        return article;
    }

    private createFbArticle(article: Article, user: User): any {
        return {
            uid: user.uid,
            timestamp: Date.now(),
            title: article.title,
            body: article.body
        };
    }
}
