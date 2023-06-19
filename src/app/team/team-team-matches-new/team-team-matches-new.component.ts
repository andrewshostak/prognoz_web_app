import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamTeamMatchSearch } from '@models/search/team/team-team-match-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { TeamStageService } from '@services/v2/team-stage.service';
import { CompetitionService } from '@services/v2/competition.service';
import { TeamTeamMatchService } from '@services/v2/team-team-match.service';
import { SettingsService } from '@services/settings.service';
import { groupBy } from 'lodash';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-team-team-matches-new',
   templateUrl: './team-team-matches-new.component.html',
   styleUrls: ['./team-team-matches-new.component.scss']
})
export class TeamTeamMatchesNewComponent implements OnInit {
   public teamTeamMatches: TeamTeamMatch[] = [];
   public groupedTeamTeamMatches: { [groupNumber: string]: TeamTeamMatch[] };

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamStageService: TeamStageService,
      private teamTeamMatchService: TeamTeamMatchService
   ) {}

   public clickOnTeamStageSelectButton(event: { teamStageId: number }): void {
      this.router.navigate(['/team', 'team-matches', { team_stage_id: event.teamStageId }]);
   }

   public ngOnInit(): void {
      this.subscribeToTeamStageIdUrlParamChange();
   }

   private getTeamTeamMatchesObservable(teamStageId: number, includeRelations: boolean): Observable<PaginatedResponse<TeamTeamMatch>> {
      const search: TeamTeamMatchSearch = {
         page: 1,
         teamStageId,
         relations: includeRelations ? ['homeTeam', 'awayTeam', 'homeTeamGoalkeeper', 'awayTeamGoalkeeper'] : [],
         limit: SettingsService.maxLimitValues.teamTeamMatches
      };
      return this.teamTeamMatchService.getTeamTeamMatches(search);
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params
         .pipe(
            filter(params => params.team_stage_id),
            switchMap(params => this.getTeamTeamMatchesObservable(params.team_stage_id, true)),
            tap((response: PaginatedResponse<TeamTeamMatch>) => this.setTeamTeamMatches(response)) as any
         )
         .subscribe();
   }

   private setTeamTeamMatches(response: PaginatedResponse<TeamTeamMatch>): void {
      if (response.data.length && response.data[0].group_number) {
         this.groupedTeamTeamMatches = groupBy(response.data, teamTeamMatch => teamTeamMatch.group_number);
         this.teamTeamMatches = [];
      } else {
         this.teamTeamMatches = response.data;
         this.groupedTeamTeamMatches = null;
      }
   }
}
