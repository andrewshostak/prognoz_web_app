import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamTeamMatchNew } from '@models/v2/team-team-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamTeamMatchSearch } from '@models/search/team-team-match-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
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
   public teamTeamMatches: TeamTeamMatchNew[] = [];
   public groupedTeamTeamMatches: { [groupNumber: string]: TeamTeamMatchNew[] };

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamStageService: TeamStageNewService,
      private teamTeamMatchService: TeamTeamMatchNewService
   ) {}

   public clickOnTeamStageSelectButton(event: { teamStageId: number }): void {
      this.router.navigate(['/team', 'team-matches', { team_stage_id: event.teamStageId }]);
   }

   public ngOnInit(): void {
      this.subscribeToTeamStageIdUrlParamChange();
   }

   private getTeamTeamMatchesObservable(teamStageId: number, includeRelations: boolean): Observable<PaginatedResponse<TeamTeamMatchNew>> {
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
            tap((response: PaginatedResponse<TeamTeamMatchNew>) => this.setTeamTeamMatches(response)) as any
         )
         .subscribe();
   }

   private setTeamTeamMatches(response: PaginatedResponse<TeamTeamMatchNew>): void {
      if (response.data.length && response.data[0].group_number) {
         this.groupedTeamTeamMatches = groupBy(response.data, teamTeamMatch => teamTeamMatch.group_number);
         this.teamTeamMatches = [];
      } else {
         this.teamTeamMatches = response.data;
         this.groupedTeamTeamMatches = null;
      }
   }
}
