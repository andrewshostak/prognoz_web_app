import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamMatchNew } from '@models/new/team-match-new.model';
import { TeamMatchNewService } from '@services/new/team-match-new.service';

@Component({
   selector: 'app-team-match-edit',
   styleUrls: ['./team-match-edit.component.scss'],
   templateUrl: './team-match-edit.component.html'
})
export class TeamMatchEditComponent implements OnInit {
   public teamMatch: TeamMatchNew;

   constructor(private activatedRoute: ActivatedRoute, private teamMatchService: TeamMatchNewService) {}

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
