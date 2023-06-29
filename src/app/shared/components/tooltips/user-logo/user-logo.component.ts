import { Component, Input } from '@angular/core';

import { User } from '@models/v2/user.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-user-logo',
   styleUrls: ['./user-logo.component.scss'],
   templateUrl: './user-logo.component.html'
})
export class UserLogoComponent {
   @Input() public user: User;

   public userDefaultImage: string = SettingsService.userDefaultImage;
   public usersLogosPath: string = SettingsService.imageBaseUrl.users;

   get src(): string {
      return this.usersLogosPath + '/' + (this.user.image || this.userDefaultImage);
   }
}
