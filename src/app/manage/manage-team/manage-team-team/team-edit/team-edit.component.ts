import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Team } from '@models/v2/team/team.model';
import { User } from '@models/v2/user.model';
import { TeamService } from '@services/api/v2/team/team.service';

@Component({
   selector: 'app-team-edit',
   templateUrl: './team-edit.component.html',
   styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent implements OnInit {
   public team: Team;
   public captain: User;

   constructor(private activatedRoute: ActivatedRoute, private teamService: TeamService) {}

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
