import { Component, Input } from '@angular/core';

import { User } from '@models/v2/user.model';

@Component({
   selector: 'app-cup-cup-match-user-name',
   templateUrl: './cup-cup-match-user-name.component.html'
})
export class CupCupMatchUserNameComponent {
   @Input() public user: User;
   @Input() public count: number;
}
