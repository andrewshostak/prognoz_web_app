import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable()
export class HeaderImageService {
   public getBackgroundImageValue(): string {
      return `url('/assets/img/${this.getImage()}')`;
   }

   private getImage(): string {
      const month = moment().format('MMMM');

      switch (true) {
         case ['December', 'January', 'February'].includes(month):
            return 'winter.jpg';
         case ['March', 'April'].includes(month):
            return 'flowers.jpg';
         case ['May', 'June'].includes(month):
            return 'forest.jpg';
         case ['July', 'August'].includes(month):
            return 'mountains.jpg';
         case ['September'].includes(month):
            return 'stadium.jpg';
         case ['October', 'November'].includes(month):
            return 'autumn.jpg';
         default:
            return 'stadium.jpg';
      }
   }
}
