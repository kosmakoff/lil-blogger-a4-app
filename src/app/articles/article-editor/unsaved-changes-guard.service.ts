import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { DialogService } from '../../shared/services/dialog.service';

import { ArticleEditorComponent } from './article-editor.component';

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<ArticleEditorComponent> {
    constructor(private dialogService: DialogService) { }

    canDeactivate(component: ArticleEditorComponent, currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isDirty = component.articleForm.dirty;

        return !isDirty || this.dialogService.confirm('Close without saving changes?');
    }
}
