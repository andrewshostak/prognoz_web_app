import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CompetitionService } from '@services/competition.service';
import { TitleService } from '@services/title.service';
import { TeamMatchNewService } from '@services/new/team-match-new.service';
import { TeamMatchSearch } from '@models/search/team-match-search.model';
import { TeamMatchNew } from '@models/new/team-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { SettingsService } from '@services/settings.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-team-results',
   templateUrl: './team-results.component.html',
   styleUrls: ['./team-results.component.scss']
})
export class TeamResultsComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private router: Router,
      private teamMatchService: TeamMatchNewService,
      private titleService: TitleService
   ) {}

   public teamMatches: TeamMatchNew[] = [];

   public teamStageSelected(event: { teamStageId: number }): void {
      this.router.navigate(['/team', 'results', { team_stage_id: event.teamStageId }]);
   }

   public ngOnInit(): void {
      this.subscribeToTeamStageIdUrlParamChange();
   }

   private getTeamMatchesObservable(teamStageId: number): Observable<PaginatedResponse<TeamMatchNew>> {
      this.titleService.setTitle('Результати - Командний');
      const search: TeamMatchSearch = {
         teamStageId,
         page: 1,
         limit: SettingsService.maxLimitValues.teamMatches,
         relations: ['match.clubHome', 'match.clubAway']
      };
      return this.teamMatchService.getTeamMatches(search);
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params
         .pipe(
            filter(params => params.team_stage_id),
            switchMap(params => this.getTeamMatchesObservable(params.team_stage_id)),
            tap((response: PaginatedResponse<TeamMatchNew>) => (this.teamMatches = response.data)) as any
         )
         .subscribe();
   }
}
