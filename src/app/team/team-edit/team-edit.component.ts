import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Team } from '@models/v2/team/team.model';
import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { TeamService } from '@services/api/v2/team/team.service';

@Component({
   selector: 'app-team-edit',
   templateUrl: './team-edit.component.html',
   styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent implements OnInit {
   public team: Team;
   public user: User;
   public notCaptainsTeamMessage: string;

   constructor(
      private activatedRoute: ActivatedRoute,
      private currentStateService: CurrentStateService,
      private teamService: TeamService
   ) {}

   public ngOnInit() {
      this.user = this.currentStateService.getUser();
      this.team = { captain_id: this.user.id } as Team;
      this.activatedRoute.params.forEach((params: Params) => {
         this.getTeamData(params.id);
      });
   }

   private getTeamData(id: number): void {
      this.teamService.getTeam(id).subscribe(response => {
         if (response.captain_id !== this.user.id) {
            this.notCaptainsTeamMessage = 'Ви не можете редагувати команду, капітаном якої є ' + response.captain.name;
            return;
         }
         this.team = response;
      });
   }
}
