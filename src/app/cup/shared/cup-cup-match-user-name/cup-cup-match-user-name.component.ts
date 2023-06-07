import { Component, Input } from '@angular/core';

import { UserNew } from '@models/v2/user-new.model';

@Component({
   selector: 'app-cup-cup-match-user-name',
   templateUrl: './cup-cup-match-user-name.component.html'
})
export class CupCupMatchUserNameComponent {
   @Input() public user: UserNew;
   @Input() public count: number;
}
