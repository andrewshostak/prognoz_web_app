import { Component, Input } from '@angular/core';

import { User } from '@models/v2/user.model';
import { User as UserV1 } from '@models/v1/user.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-user-logo',
   styleUrls: ['./user-logo.component.scss'],
   templateUrl: './user-logo.component.html'
})
export class UserLogoComponent {
   @Input() public user: User | UserV1;

   public userDefaultImage: string = SettingsService.userDefaultImage;
   public usersLogosPath: string = SettingsService.usersLogosPath + '/';

   get src(): string {
      return this.usersLogosPath + (this.user.image || this.userDefaultImage);
   }
}
