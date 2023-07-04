import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TitleService } from '@services/title.service';
import { TeamMatchService } from '@services/api/v2/team/team-match.service';
import { TeamMatchSearch } from '@models/search/team/team-match-search.model';
import { TeamMatch } from '@models/v2/team/team-match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { PaginationService } from '@services/pagination.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-team-results',
   templateUrl: './team-results.component.html',
   styleUrls: ['./team-results.component.scss']
})
export class TeamResultsComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private teamMatchService: TeamMatchService,
      private titleService: TitleService
   ) {}

   public teamMatches: TeamMatch[] = [];

   public teamStageSelected(event: { teamStageId: number }): void {
      this.router.navigate(['/team', 'results', { team_stage_id: event.teamStageId }]);
   }

   public ngOnInit(): void {
      this.subscribeToTeamStageIdUrlParamChange();
   }

   private getTeamMatchesObservable(teamStageId: number): Observable<PaginatedResponse<TeamMatch>> {
      this.titleService.setTitle('Результати - Командний');
      const search: TeamMatchSearch = {
         teamStageId,
         page: 1,
         limit: PaginationService.limit.teamMatches,
         relations: ['match.clubHome', 'match.clubAway'],
         orderBy: 'id',
         sequence: Sequence.Ascending
      };
      return this.teamMatchService.getTeamMatches(search);
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params
         .pipe(
            filter(params => params.team_stage_id),
            switchMap(params => this.getTeamMatchesObservable(params.team_stage_id)),
            tap((response: PaginatedResponse<TeamMatch>) => (this.teamMatches = response.data))
         )
         .subscribe();
   }
}
