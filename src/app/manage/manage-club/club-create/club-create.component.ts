import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ClubNew } from '@models/v2/club-new.model';

@Component({
   selector: 'app-club-create',
   templateUrl: './club-create.component.html',
   styleUrls: ['./club-create.component.scss']
})
export class ClubCreateComponent {
   constructor(private router: Router) {}

   public successfullySubmitted(club: ClubNew): void {
      this.router.navigate(['/', 'manage', 'clubs', club.id, 'edit']);
   }
}
