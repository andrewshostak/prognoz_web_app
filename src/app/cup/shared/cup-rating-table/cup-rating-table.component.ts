import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SeasonState } from '@enums/season-state.enum';
import { CupRating } from '@models/cup/cup-rating.model';
import { SeasonNew } from '@models/new/season-new.model';
import { User } from '@models/user.model';

@Component({
   selector: 'app-cup-rating-table',
   templateUrl: './cup-rating-table.component.html',
   styleUrls: ['./cup-rating-table.component.scss']
})
export class CupRatingTableComponent implements OnChanges {
   @Input() public cupRating: CupRating[];
   @Input() public errorCupRating: string;
   @Input() public authenticatedUser: User;
   @Input() public seasons: SeasonNew[];

   public activeSeason: SeasonNew;
   public beforePreviousSeason: SeasonNew;
   public previousSeason: SeasonNew;

   public ngOnChanges(changes: SimpleChanges) {
      for (const propName of Object.keys(changes)) {
         if (!changes[propName].firstChange && propName === 'seasons') {
            const seasonIds: number[] = [];
            changes[propName].currentValue.forEach((season: SeasonNew) => {
               if (season.state === SeasonState.Active) {
                  this.activeSeason = season;
                  seasonIds.push(season.id);
               } else if (this.activeSeason && !this.previousSeason) {
                  this.previousSeason = season;
                  seasonIds.push(season.id);
               } else if (this.previousSeason && !this.beforePreviousSeason) {
                  this.beforePreviousSeason = season;
                  seasonIds.push(season.id);
               }
            });
         }
      }
   }
}
