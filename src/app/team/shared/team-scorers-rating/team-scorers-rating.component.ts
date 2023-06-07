import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamRatingUserNew } from '@models/v2/team-rating-user-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { groupBy, Dictionary } from 'lodash';

@Component({
   selector: 'app-team-scorers-rating',
   templateUrl: './team-scorers-rating.component.html'
})
export class TeamScorersRatingComponent implements OnChanges {
   @Input() scorers: TeamRatingUserNew[];
   @Input() authenticatedUser: UserNew;

   public groupedByScores: Dictionary<TeamRatingUserNew[]> = {};

   ngOnChanges(changes: SimpleChanges) {
      if (changes.scorers && changes.scorers.currentValue) {
         this.groupedByScores = groupBy(changes.scorers.currentValue, 'scored');
      }
   }
}
