import { Component, Input } from '@angular/core';

import { environment } from '@env';
import { UserNew } from '@models/new/user-new.model';
import { User } from '@models/user.model';

@Component({
   selector: 'app-user-logo-with-tooltip',
   styleUrls: ['./user-logo-with-tooltip.component.scss'],
   templateUrl: './user-logo-with-tooltip.component.html'
})
export class UserLogoWithTooltipComponent {
   @Input() public user: User | UserNew;

   public userImageDefault: string = environment.imageUserDefault;
   public userImagesUrl: string = environment.apiImageUsers;

   get src(): string {
      return this.userImagesUrl + (this.user.image || this.userImageDefault);
   }
}
