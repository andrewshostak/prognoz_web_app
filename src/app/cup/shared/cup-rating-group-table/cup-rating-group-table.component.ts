import { Component, Input } from '@angular/core';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-cup-rating-group-table',
   templateUrl: './cup-rating-group-table.component.html',
   styleUrls: ['./cup-rating-group-table.component.scss']
})
export class CupRatingGroupTableComponent {
   @Input() competitionId: number;
   @Input() cupRatingGroup: CupRatingGroup[];
   @Input() highlightConfig: { promotion?: number[]; possible_promotion?: number[]; other_competition?: number[] };

   public getHomeCityInBrackets(hometown: string): string {
      return UtilsService.getHomeCityInBrackets(hometown);
   }

   public showPositionHighlight(index: number, key: string): boolean {
      if (!this.highlightConfig) {
         return false;
      }
      const promotion = this.highlightConfig[key];
      if (!promotion) {
         return false;
      }

      return promotion.includes(index + 1);
   }
}
