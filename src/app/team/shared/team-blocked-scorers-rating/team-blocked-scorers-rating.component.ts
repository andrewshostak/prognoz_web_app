import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamRatingUser } from '@models/v2/team/team-rating-user.model';
import { User } from '@models/v2/user.model';
import { Dictionary, groupBy } from 'lodash';

@Component({
   selector: 'app-team-blocked-scorers-rating',
   templateUrl: './team-blocked-scorers-rating.component.html'
})
export class TeamBlockedScorersRatingComponent implements OnChanges {
   @Input() blockedScorers: TeamRatingUser[];
   @Input() authenticatedUser: User;

   public groupedByBlockedScores: Dictionary<TeamRatingUser[]> = {};

   ngOnChanges(changes: SimpleChanges) {
      if (changes.blockedScorers && changes.blockedScorers.currentValue) {
         this.groupedByBlockedScores = groupBy(changes.blockedScorers.currentValue, 'scores_blocked');
      }
   }
}
