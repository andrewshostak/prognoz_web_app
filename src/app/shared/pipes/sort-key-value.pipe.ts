import { Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';

import { parseInt } from 'lodash';

@Pipe({
   name: 'sortKeyValue'
})
export class SortKeyValuePipe implements PipeTransform {
   transform<T>(items: KeyValue<string, T>[], parseKeyInt: boolean): KeyValue<string, T>[] {
      return items.sort((a, b) => {
         if (parseKeyInt) {
            return parseInt(a.key, 10) > parseInt(b.key, 10) ? -1 : 1;
         }
         return a.key > b.key ? -1 : 1;
      });
   }
}
