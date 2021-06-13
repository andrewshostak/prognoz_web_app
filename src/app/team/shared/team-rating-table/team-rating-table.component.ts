import { Component, Input } from '@angular/core';

import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamRating } from '@models/team/team-rating.model';
import { UtilsService } from '@services/utils.service';
import { get } from 'lodash';

@Component({
   selector: 'app-team-rating-table',
   styleUrls: ['./team-rating-table.component.scss'],
   templateUrl: './team-rating-table.component.html'
})
export class TeamRatingTableComponent {
   @Input() public teamRating: TeamRating[];
   @Input() public competition: CompetitionNew;

   public makeUnsigned = UtilsService.makeUnsigned;

   public relegation(index: number, count: number): boolean {
      const relegation = get(this.competition, 'config.team.relegation');
      if (!relegation) {
         return false;
      }

      return relegation >= count - index;
   }

   public promotion(index: number): boolean {
      const promotion = get(this.competition, 'config.team.promotion');
      if (!promotion) {
         return false;
      }

      return promotion >= index + 1;
   }
}
