import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Win } from '@models/v2/win.model';
import { SettingsService } from '@services/settings.service';
import { AwardService } from '@services/v2/award.service';
import { groupBy } from 'lodash';

@Component({
   selector: 'app-user-wins-awards',
   templateUrl: './user-wins-awards.component.html',
   styleUrls: ['./user-wins-awards.component.scss']
})
export class UserWinsAwardsComponent implements OnChanges {
   @Input() public wins: Win[] = [];

   public awardsLogosPath = SettingsService.imageBaseUrl.awards;
   public groupedWins: { [awardId: number]: Win[] } = {};
   public isChampionshipSeasonWinner = AwardService.isChampionshipSeasonWinner;

   public ngOnChanges(changes: SimpleChanges) {
      this.groupedWins = groupBy(this.wins, 'award_id');
   }
}
