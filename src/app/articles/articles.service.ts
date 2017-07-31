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

    postArticle(article: Article, user: User): Promise<any> {
        const newArticleRef = this.firebaseService.database.ref(`articles`).push();
        const fbSetPromise = newArticleRef.set({
            uid: user.uid,
            timestamp: Date.now(),
            title: article.title,
            body: article.body
        });

        return PromiseUtils.fbPromiseToPromise(fbSetPromise);
    }

    private parseFbArticle(fbArticle: any): Article {
        const article = new Article();

        article.title = fbArticle.title;
        article.body = fbArticle.body;

        return article;
    }
}
