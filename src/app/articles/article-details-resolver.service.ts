import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Article } from '../shared/models/article.model';

import { ArticlesService } from './articles.service';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class ArticleDetailsResolver implements Resolve<Article | null> {
    constructor(private articleService: ArticlesService, private alertService: AlertService, private router: Router) {
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Article | null> {
        const articleId = route.paramMap.get('id');

        if (!articleId) {
            throw new Error(`ID parameter was not passed to ArticleDetailsResolver`);
        }

        const article = await this.articleService.getArticle(articleId);

        if (article) {
            return article;
        } else {
            this.alertService.error('Article with given id was not found.', true, 2000);
            this.router.navigate(['/articles']);
            return null;
        }
    }
}
