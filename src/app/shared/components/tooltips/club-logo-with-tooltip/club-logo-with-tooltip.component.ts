import { Component, Input } from '@angular/core';

import { Club } from '@models/club.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-club-logo-with-tooltip',
   templateUrl: './club-logo-with-tooltip.component.html',
   styleUrls: ['./club-logo-with-tooltip.component.scss']
})
export class ClubLogoWithTooltipComponent {
   @Input() club: Club;

   private clubsLogosPath: string = SettingsService.clubsLogosPath + '/';

   get src(): string {
      return this.clubsLogosPath + this.club.image;
   }
}
