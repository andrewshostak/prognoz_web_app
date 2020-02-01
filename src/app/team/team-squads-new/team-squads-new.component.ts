import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { UserNew } from '@models/new/user-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamParticipantSearch } from '@models/search/team-participant-search.model';
import { TeamSearch } from '@models/search/team-search.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { forkJoin, Observable, ObservableInput, of, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
   selector: 'app-team-squads-new',
   templateUrl: './team-squads-new.component.html',
   styleUrls: ['./team-squads-new.component.scss']
})
export class TeamSquadsNewComponent implements OnDestroy, OnInit {
   public competition: CompetitionNew;
   public showCreateTeamButton: boolean;
   public teams: TeamNew[];
   public user: UserNew;

   private destroyed$ = new Subject();

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private competitionService: CompetitionNewService,
      private teamParticipantService: TeamParticipantNewService,
      private teamService: TeamNewService,
      private titleService: TitleService
   ) {}

   public ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   public ngOnInit(): void {
      this.user = this.authService.getUser();
      this.titleService.setTitle('Заявки на участь / склади команд - Командний');
      this.activatedRoute.parent.params.pipe(takeUntil(this.destroyed$)).subscribe((params: Params) => {
         this.showCreateTeamButton = false;
         const requests: [ObservableInput<{ competition: CompetitionNew }>, ObservableInput<PaginatedResponse<TeamNew>>] = [
            this.getCompetitionObservable(params.competitionId),
            this.getTeamsObservable(params.competitionId)
         ];
         forkJoin(requests)
            .pipe(
               map(([competitionResponse, teamsResponse]) => {
                  return { competitionResponse, teamsResponse };
               }),
               mergeMap(response => {
                  this.competition = response.competitionResponse.competition;
                  this.teams = response.teamsResponse.data;

                  return this.user && this.competition.stated ? this.getTeamParticipantsObservable(this.user.id) : of(null);
               })
            )
            .subscribe(response => {
               this.showCreateTeamButton = response && response.total < 1;
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

   private getTeamParticipantsObservable(userId: number): Observable<PaginatedResponse<TeamParticipantNew>> {
      const search: TeamParticipantSearch = {
         ended: ModelStatus.Falsy,
         limit: 1,
         page: 1,
         refused: ModelStatus.Falsy,
         userId
      };
      return this.teamParticipantService.getTeamParticipants(search);
   }
}
