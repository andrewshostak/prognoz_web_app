import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TeamNew } from '@models/new/team-new.model';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';

@Component({
   selector: 'app-team-create',
   templateUrl: './team-create.component.html',
   styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
   public user: UserNew;

   constructor(private authService: AuthNewService, private router: Router) {}

   public ngOnInit(): void {
      this.user = this.authService.getUser();
   }

   public successfullySubmitted(team: TeamNew): void {
      this.router.navigate(['/', 'team', team.id, 'edit']);
   }
}
