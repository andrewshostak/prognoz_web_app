import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Win } from '@models/win.model';
import { SettingsService } from '@services/settings.service';
import { AwardNewService } from '@services/new/award-new.service';
import { groupBy } from 'lodash';

@Component({
   selector: 'app-user-wins-awards',
   templateUrl: './user-wins-awards.component.html',
   styleUrls: ['./user-wins-awards.component.scss']
})
export class UserWinsAwardsComponent implements OnChanges {
   @Input() public wins: Win[] = [];

   public awardsLogosPath = SettingsService.awardsLogosPath;
   public groupedWins: { [awardId: number]: Win[] } = {};
   public isChampionshipSeasonWinner = AwardNewService.isChampionshipSeasonWinner;

   public ngOnChanges(changes: SimpleChanges) {
      this.groupedWins = groupBy(this.wins, 'award_id');
   }
}
