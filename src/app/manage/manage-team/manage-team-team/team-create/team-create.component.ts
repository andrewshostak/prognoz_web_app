import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TeamNew } from '@models/new/team-new.model';

@Component({
   selector: 'app-team-create',
   templateUrl: './team-create.component.html',
   styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent {
   constructor(private router: Router) {}

   public successfullySubmitted(team: TeamNew): void {
      this.router.navigate(['/', 'manage', 'team', 'teams', team.id, 'edit']);
   }
}
