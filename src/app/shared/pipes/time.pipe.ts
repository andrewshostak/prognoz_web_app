import { Pipe, PipeTransform } from '@angular/core';

declare const moment: any;

@Pipe({
    name: 'time'
})
export class TimePipe implements PipeTransform {

    transform(value: string, format: string): any {
        if (!Date.parse(value)) {
            return value;
        }

        moment.locale('uk');
        if (format === 'calendar') {
            return moment(value).calendar();
        } else if (format === 'fromNow') {
            return moment(value).fromNow();
        } else {
            return moment(value).format(format);
        }
    }
}
