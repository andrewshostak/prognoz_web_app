import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Team } from '@models/v2/team/team.model';

@Component({
   selector: 'app-team-create',
   templateUrl: './team-create.component.html',
   styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent {
   constructor(private router: Router) {}

   public successfullySubmitted(team: Team): void {
      this.router.navigate(['/', 'manage', 'team', 'teams', team.id, 'edit']);
   }
}
