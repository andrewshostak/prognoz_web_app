import { Component, Input } from '@angular/core';

import { ClubNew } from '@models/new/club-new.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-club-logo',
   templateUrl: './club-logo.component.html',
   styleUrls: ['./club-logo.component.scss']
})
export class ClubLogoComponent {
   @Input() club: ClubNew;

   private clubsLogosPath: string = SettingsService.clubsLogosPath + '/';

   get src(): string {
      return this.clubsLogosPath + this.club.image;
   }
}
