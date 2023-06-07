import { Component, Input } from '@angular/core';

import { Team } from '@models/v2/team/team.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-team-logo',
   styleUrls: ['./team-logo.component.scss'],
   templateUrl: './team-logo.component.html'
})
export class TeamLogoComponent {
   @Input() public team: Team;
   @Input() public showTooltip: boolean = true;

   private teamLogosPath: string = SettingsService.teamsLogosPath + '/';

   get src(): string {
      return this.teamLogosPath + (this.team.image || 'default.jpeg');
   }
}
