import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamRatingUser } from '@models/v2/team/team-rating-user.model';
import { User } from '@models/v2/user.model';
import { Dictionary, groupBy } from 'lodash';

@Component({
   selector: 'app-team-goalkeepers-rating',
   templateUrl: './team-goalkeepers-rating.component.html'
})
export class TeamGoalkeepersRatingComponent implements OnChanges {
   @Input() goalkeepers: TeamRatingUser[];
   @Input() authenticatedUser: User;

   groupedBySaves: Dictionary<TeamRatingUser[]> = {};

   ngOnChanges(changes: SimpleChanges) {
      if (changes.goalkeepers && changes.goalkeepers.currentValue) {
         this.groupedBySaves = groupBy(changes.goalkeepers.currentValue, 'blocked');
      }
   }
}
