import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamNew } from '@models/new/team-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamSearch } from '@models/search/team-search.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
   selector: 'app-team-squads-new',
   templateUrl: './team-squads-new.component.html',
   styleUrls: ['./team-squads-new.component.scss']
})
export class TeamSquadsNewComponent implements OnDestroy, OnInit {
   public competition: CompetitionNew;
   public teams: TeamNew[];

   private destroyed$ = new Subject();

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private teamService: TeamNewService,
      private titleService: TitleService
   ) {}

   public ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   public ngOnInit(): void {
      this.titleService.setTitle('Заявки на участь / склади команд - Командний');
      this.activatedRoute.parent.params.pipe(takeUntil(this.destroyed$)).subscribe((params: Params) => {
         const requests = [this.getCompetitionObservable(params.competitionId), this.getTeamsObservable(params.competitionId)];
         forkJoin(requests)
            .pipe(
               map(([competitionResponse, teamsResponse]) => {
                  return { competitionResponse, teamsResponse };
               })
            )
            .subscribe(response => {
               this.competition = response.competitionResponse.competition;
               this.teams = response.teamsResponse.data;
            });
      });
   }

   private getCompetitionObservable(id: number): Observable<{ competition: CompetitionNew }> {
      return this.competitionService.getCompetition(id);
   }

   private getTeamsObservable(competitionId: number): Observable<PaginatedResponse<TeamNew>> {
      const search: TeamSearch = {
         competitionId,
         orderBy: 'updated_at',
         sequence: Sequence.Descending,
         limit: SettingsService.maxLimitValues.teamTeams,
         page: 1
      };
      return this.teamService.getTeams(search);
   }
}
