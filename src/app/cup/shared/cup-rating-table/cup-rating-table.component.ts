import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CupRatingCalculatedNew } from '@models/v2/cup-rating-calculated-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { User } from '@models/user.model';

@Component({
   selector: 'app-cup-rating-table',
   templateUrl: './cup-rating-table.component.html',
   styleUrls: ['./cup-rating-table.component.scss']
})
export class CupRatingTableComponent implements OnChanges {
   @Input() public cupRating: CupRatingCalculatedNew[];
   @Input() public authenticatedUser: User;

   seasons: { [id: number]: { title: string; coefficient: number } } = {};
   cupRatingForTemplate: {
      season_points: { [seasonId: number]: number };
      points_calculated: number;
      user: UserNew;
      user_id: number;
   }[] = [];

   ngOnChanges(changes: SimpleChanges) {
      if (changes.cupRating && changes.cupRating.currentValue) {
         this.prepareViewData(changes.cupRating.currentValue as CupRatingCalculatedNew[]);
      }
   }

   private prepareViewData(cupRatingCalculated: CupRatingCalculatedNew[]): void {
      let maxSeasonsLength = 0;
      cupRatingCalculated.forEach(cupRatingCalculatedItem => {
         if (cupRatingCalculatedItem.rating_items.length > maxSeasonsLength) {
            maxSeasonsLength = cupRatingCalculatedItem.rating_items.length;

            cupRatingCalculatedItem.rating_items.forEach(cupRatingItem => {
               this.seasons[cupRatingItem.season.id] = { title: cupRatingItem.season.title, coefficient: cupRatingItem.season.coefficient };
            });
         }

         this.cupRatingForTemplate.push({
            points_calculated: parseFloat(cupRatingCalculatedItem.points_calculated.toFixed(3)),
            user: cupRatingCalculatedItem.user,
            user_id: cupRatingCalculatedItem.user_id,
            season_points: cupRatingCalculatedItem.rating_items.reduce((acc, obj) => {
               acc[obj.season_id] = parseFloat((obj.points * this.seasons[obj.season_id].coefficient).toFixed(3));
               return acc;
            }, {})
         });
      });
   }
}
