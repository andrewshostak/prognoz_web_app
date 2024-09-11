import { Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';

import { parseInt } from 'lodash';

@Pipe({
   name: 'sortKeyValue'
})
export class SortKeyValuePipe implements PipeTransform {
   transform<T>(items: KeyValue<string, T>[], parseKeyInt: boolean, sequence: 'asc' | 'desc' = 'desc'): KeyValue<string, T>[] {
      const direction = sequence === 'desc' ? -1 : 1;

      return items.sort((a, b) => {
         const keyA = parseKeyInt ? parseInt(a.key, 10) : a.key;
         const keyB = parseKeyInt ? parseInt(b.key, 10) : b.key;

         return direction * (keyA > keyB ? 1 : keyA < keyB ? -1 : 0);
      });
   }
}
