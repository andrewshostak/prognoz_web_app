import { Component, Input } from '@angular/core';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';

@Component({
   selector: 'app-cup-rating-group-table',
   templateUrl: './cup-rating-group-table.component.html',
   styleUrls: ['./cup-rating-group-table.component.scss']
})
export class CupRatingGroupTableComponent {
   @Input() cupRatingGroup: CupRatingGroup[];
   @Input() highlightConfig: { promotion: number[]; possible_promotion: number[]; other_competition: number[] };

   showPositionHighlight(index: number, type: string): boolean {
      if (type === 'promotion') {
         return this.highlightConfig.promotion.includes(index + 1);
      } else if (type === 'possible_promotion') {
         return this.highlightConfig.possible_promotion.includes(index + 1);
      } else if (type === 'other_competition') {
         return this.highlightConfig.other_competition.includes(index + 1);
      }
      return false;
   }
}
