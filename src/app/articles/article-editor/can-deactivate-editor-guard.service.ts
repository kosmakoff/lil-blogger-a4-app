import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { DialogService } from '../../shared/services/dialog.service';

import { ArticleEditorComponent } from './article-editor.component';

@Injectable()
export class CanDeactivateEditor implements CanDeactivate<ArticleEditorComponent> {
    constructor(private dialogService: DialogService) { }

    canDeactivate(component: ArticleEditorComponent, currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        debugger;
        const isDirty = component.articleForm.dirty;

        return !isDirty || this.dialogService.confirm('Close without saving changes?');
    }
}