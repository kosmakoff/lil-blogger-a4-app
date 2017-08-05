import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ellipsis',
    pure: true
})
export class EllipsisPipe implements PipeTransform {
    transform(value: string, count: number): string {
        if (value.length <= count) {
            return value;
        } else {
            return value.slice(0, count) + '…';
        }
    }
}
