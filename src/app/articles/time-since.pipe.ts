import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
    name: 'timeSince',
    pure: true
})
export class TimeSincePipe implements PipeTransform {
    transform(value: number): string {
        return moment(value).fromNow();
    }
}
