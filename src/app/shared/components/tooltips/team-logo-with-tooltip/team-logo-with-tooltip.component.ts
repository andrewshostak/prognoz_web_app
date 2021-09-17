import { Component, Input } from '@angular/core';

import { TeamNew } from '@models/new/team-new.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-team-logo-with-tooltip',
   styleUrls: ['./team-logo-with-tooltip.component.scss'],
   templateUrl: './team-logo-with-tooltip.component.html'
})
export class TeamLogoWithTooltipComponent {
   @Input() public team: TeamNew;

   private teamLogosPath: string = SettingsService.teamsLogosPath + '/';

   get src(): string {
      return this.teamLogosPath + (this.team.image || 'default.jpeg');
   }
}
