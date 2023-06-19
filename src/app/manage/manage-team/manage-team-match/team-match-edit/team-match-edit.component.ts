import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamMatch } from '@models/v2/team/team-match.model';
import { TeamMatchService } from '@services/v2/team-match.service';

@Component({
   selector: 'app-team-match-edit',
   styleUrls: ['./team-match-edit.component.scss'],
   templateUrl: './team-match-edit.component.html'
})
export class TeamMatchEditComponent implements OnInit {
   public teamMatch: TeamMatch;

   constructor(private activatedRoute: ActivatedRoute, private teamMatchService: TeamMatchService) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getTeamMatchData(params.id);
      });
   }

   private getTeamMatchData(teamMatchId: number): void {
      this.teamMatchService.getTeamMatch(teamMatchId).subscribe(response => {
         this.teamMatch = response;
      });
   }
}
