import { Component, Input } from '@angular/core';

import { UserNew } from '@models/new/user-new.model';
import { User } from '@models/user.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-user-logo-with-tooltip',
   styleUrls: ['./user-logo-with-tooltip.component.scss'],
   templateUrl: './user-logo-with-tooltip.component.html'
})
export class UserLogoWithTooltipComponent {
   @Input() public user: User | UserNew;

   public userDefaultImage: string = SettingsService.userDefaultImage;
   public usersLogosPath: string = SettingsService.usersLogosPath + '/';

   get src(): string {
      return this.usersLogosPath + (this.user.image || this.userDefaultImage);
   }
}
