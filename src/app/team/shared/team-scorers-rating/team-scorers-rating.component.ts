import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamRatingUser } from '@models/v2/team/team-rating-user.model';
import { User } from '@models/v2/user.model';
import { groupBy, Dictionary } from 'lodash';

@Component({
   selector: 'app-team-scorers-rating',
   templateUrl: './team-scorers-rating.component.html'
})
export class TeamScorersRatingComponent implements OnChanges {
   @Input() scorers: TeamRatingUser[];
   @Input() authenticatedUser: User;

   public groupedByScores: Dictionary<TeamRatingUser[]> = {};

   ngOnChanges(changes: SimpleChanges) {
      if (changes.scorers && changes.scorers.currentValue) {
         this.groupedByScores = groupBy(changes.scorers.currentValue, 'scored');
      }
   }
}
