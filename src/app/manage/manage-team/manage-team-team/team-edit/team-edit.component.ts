import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamNew } from '@models/v2/team-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { TeamNewService } from '@services/new/team-new.service';

@Component({
   selector: 'app-team-edit',
   templateUrl: './team-edit.component.html',
   styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent implements OnInit {
   public team: TeamNew;
   public captain: UserNew;

   constructor(private activatedRoute: ActivatedRoute, private teamService: TeamNewService) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getTeamData(params.id);
      });
   }

   private getTeamData(id: number): void {
      this.teamService.getTeam(id).subscribe(response => {
         this.team = response;
         this.captain = response.captain;
      });
   }
}
