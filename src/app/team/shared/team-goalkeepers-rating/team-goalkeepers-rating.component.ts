import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamRatingUserNew } from '@models/v2/team-rating-user-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { Dictionary, groupBy } from 'lodash';

@Component({
   selector: 'app-team-goalkeepers-rating',
   templateUrl: './team-goalkeepers-rating.component.html'
})
export class TeamGoalkeepersRatingComponent implements OnChanges {
   @Input() goalkeepers: TeamRatingUserNew[];
   @Input() authenticatedUser: UserNew;

   groupedBySaves: Dictionary<TeamRatingUserNew[]> = {};

   ngOnChanges(changes: SimpleChanges) {
      if (changes.goalkeepers && changes.goalkeepers.currentValue) {
         this.groupedBySaves = groupBy(changes.goalkeepers.currentValue, 'blocked');
      }
   }
}
