import { Component, Input } from '@angular/core';

import { User } from '@models/user.model';
import { environment } from '@env';

@Component({
    selector: 'app-user-logo-with-tooltip',
    templateUrl: './user-logo-with-tooltip.component.html',
    styleUrls: ['./user-logo-with-tooltip.component.scss']
})
export class UserLogoWithTooltipComponent {
    @Input() user: User;

    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    get src(): string {
        return this.userImagesUrl + (this.user.image || this.userImageDefault);
    }
}
