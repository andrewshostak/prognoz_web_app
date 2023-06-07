import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Club } from '@models/v2/club.model';

@Component({
   selector: 'app-club-create',
   templateUrl: './club-create.component.html',
   styleUrls: ['./club-create.component.scss']
})
export class ClubCreateComponent {
   constructor(private router: Router) {}

   public successfullySubmitted(club: Club): void {
      this.router.navigate(['/', 'manage', 'clubs', club.id, 'edit']);
   }
}
