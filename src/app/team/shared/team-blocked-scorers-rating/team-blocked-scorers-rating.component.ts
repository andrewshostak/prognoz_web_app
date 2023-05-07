import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamRatingUserNew } from '@models/new/team-rating-user-new.model';
import { UserNew } from '@models/new/user-new.model';
import { Dictionary, groupBy } from 'lodash';

@Component({
   selector: 'app-team-blocked-scorers-rating',
   templateUrl: './team-blocked-scorers-rating.component.html'
})
export class TeamBlockedScorersRatingComponent implements OnChanges {
   @Input() blockedScorers: TeamRatingUserNew[];
   @Input() authenticatedUser: UserNew;

   public groupedByBlockedScores: Dictionary<TeamRatingUserNew[]> = {};

   ngOnChanges(changes: SimpleChanges) {
      if (changes.blockedScorers && changes.blockedScorers.currentValue) {
         this.groupedByBlockedScores = groupBy(changes.blockedScorers.currentValue, 'scores_blocked');
      }
   }
}
