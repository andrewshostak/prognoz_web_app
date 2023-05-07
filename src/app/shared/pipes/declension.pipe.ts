import { Pipe, PipeTransform } from '@angular/core';

import { range } from 'lodash';

@Pipe({
   name: 'declension'
})
export class DeclensionPipe implements PipeTransform {
   transform(i: number, unchangeable: string): string {
      const stringifiedNumber = i.toString();
      const elevenToNineteen = range(11, 20).map(j => j.toString());
      const twoToFour = range(2, 5).map(j => j.toString());
      switch (true) {
         case elevenToNineteen.some(j => stringifiedNumber.endsWith(j)):
            return `${i} ${unchangeable}ів`;
         case twoToFour.some(j => stringifiedNumber.endsWith(j)):
            return `${i} ${unchangeable}и`;
         case stringifiedNumber.endsWith('1'):
            return `${i} ${unchangeable}`;
         default:
            return `${i} ${unchangeable}ів`;
      }
   }
}
