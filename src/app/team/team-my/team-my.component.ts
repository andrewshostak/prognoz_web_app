import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TeamNew } from '@models/new/team-new.model';
import { UserNew } from '@models/new/user-new.model';
import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { TeamSearch } from '@models/search/team-search.model';
import { TeamTeamMatchSearch } from '@models/search/team-team-match-search.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TitleService } from '@services/title.service';
import { filter, tap } from 'rxjs/operators';

@Component({
   selector: 'app-team-my',
   templateUrl: './team-my.component.html',
   styleUrls: ['./team-my.component.scss']
})
export class TeamMyComponent implements OnInit {
   public authenticatedUser: UserNew;
   public competitionId: number;
   public isCaptain = false;
   public noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
   public team: TeamNew;
   public teamTeamMatches: TeamTeamMatchNew[];

   constructor(
      private authService: AuthNewService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private teamMatchService: TeamMatchService,
      private teamService: TeamNewService,
      private teamTeamMatchService: TeamTeamMatchNewService,
      private titleService: TitleService
   ) {}

   public getTeamTeamMatchesData(teamStageId: number) {
      const search: TeamTeamMatchSearch = { limit: SettingsService.maxLimitValues.teamTeamMatches, page: 1, teamStageId };
      this.teamTeamMatchService.getTeamTeamMatches(search).subscribe(
         response => (this.teamTeamMatches = response.data),
         () => (this.teamTeamMatches = [])
      );
   }

   public ngOnInit() {
      this.titleService.setTitle('Вибір статегії і воротаря - Командний');
      this.authenticatedUser = this.authService.getUser();
      this.subscribeToTeamStageIdUrlParamChange();
   }

   public teamStageSelected(event: { teamStageId: number }): void {
      this.router.navigate(['/team', 'my', { team_stage_id: event.teamStageId }]);
   }

   private getTeamData(competitionId: number) {
      const search: TeamSearch = {
         competitionId,
         limit: 1,
         page: 1,
         teamParticipantId: this.authenticatedUser.id
      };
      this.teamService.getTeams(search).subscribe(
         response => {
            this.team = response.data[0] ? Object.assign({}, response.data[0]) : null;
            this.isCaptain = this.team && this.team.captain_id === this.authenticatedUser.id;
         },
         () => {
            this.team = null;
         }
      );
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params
         .pipe(
            filter(params => params.team_stage_id),
            tap((params: Params) => {
               this.getTeamData(params.team_stage_id);
               this.getTeamTeamMatchesData(params.team_stage_id);
            }) as any
         )
         .subscribe();
   }
}
