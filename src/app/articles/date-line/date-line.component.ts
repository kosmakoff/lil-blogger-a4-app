import { Component, Input } from '@angular/core';

import { Article } from '../../shared/models/article.model';
import { Profile } from '../../shared/models/profile.model';

@Component({
  selector: 'app-date-line',
  templateUrl: './date-line.component.html',
  styleUrls: ['./date-line.component.css']
})
export class DateLineComponent {
  @Input() profile: Profile;
  @Input() time: {
    createdAt: number;
    updatedAt: number | null;
  };
}
