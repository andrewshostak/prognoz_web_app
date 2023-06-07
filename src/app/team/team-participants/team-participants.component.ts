import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Competition } from '@models/v2/competition.model';
import { Team } from '@models/v2/team/team.model';
import { TeamParticipant } from '@models/v2/team/team-participant.model';
import { User } from '@models/v2/user.model';
import { OpenedModal } from '@models/opened-modal.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamParticipantSearch } from '@models/search/team-participant-search.model';
import { TeamSearch } from '@models/search/team-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthNewService } from '@services/new/auth-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamCompetitionNewService } from '@services/new/team-competition-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';
import { forkJoin, Observable, ObservableInput, of, Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
   selector: 'app-team-participants',
   templateUrl: './team-participants.component.html',
   styleUrls: ['./team-participants.component.scss']
})
export class TeamParticipantsComponent implements OnDestroy, OnInit {
   public allUserApplications: TeamParticipant[];
   public competition: Competition;
   public competitionStates = CompetitionState;
   public openedModal: OpenedModal<null>;
   public showCreateTeamButton: boolean;
   public teams: Team[];
   public user: User;
   public currentUserTeamId: number;

   private destroyed$ = new Subject();

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private competitionService: CompetitionNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamCompetitionService: TeamCompetitionNewService,
      private teamParticipantService: TeamParticipantNewService,
      private teamService: TeamNewService,
      private titleService: TitleService
   ) {}

   get numberOfConfirmedTeams(): number {
      return this.teams.filter(team => team.confirmed).length;
   }

   public competitionSelected(event: { selected: Competition | Partial<Competition> }): void {
      this.router.navigate(['/team', 'participants', { competition_id: event.selected.id }]);
   }

   public teamParticipantCreated(): void {
      this.showCreateTeamButton = false;
   }

   public ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   public ngOnInit(): void {
      this.user = this.authService.getUser();
      this.titleService.setTitle('Заявки на участь / склади команд - Командний');
      this.activatedRoute.params
         .pipe(
            takeUntil(this.destroyed$),
            filter(params => params.competition_id)
         )
         .subscribe((params: Params) => {
            this.getPageData(params.competition_id);
         });
   }

   public openTeamSelectModal(content: NgbModalRef | TemplateRef<any>): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data: null, submitted: () => {} };
   }

   public teamSelected(team: Team): void {
      const callbacks = {
         successful: () => {
            this.getPageData(this.competition.id);
            this.notificationsService.success('Успішно', `Заявку в команду ${team.name} подано`);
            this.openedModal.reference.close();
         },
         error: () => this.openedModal.reference.close()
      };
      this.teamCompetitionService.updateTeamCreateAndUpdateCaptain(team, this.competition.id, callbacks);
   }

   private getAllUserApplicationsObservable(competitionId: number, userId): Observable<PaginatedResponse<TeamParticipant>> {
      const search: TeamParticipantSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.teamParticipants,
         competitionId,
         userId
      };
      return this.teamParticipantService.getTeamParticipants(search);
   }

   private getCompetitionObservable(id: number): Observable<Competition> {
      return this.competitionService.getCompetition(id);
   }

   private getCurrentUserTeamId(teamParticipants: TeamParticipant[]): number {
      const teamParticipant = teamParticipants.find(participant => {
         return participant.confirmed && participant.user_id === this.user.id;
      });

      return teamParticipant ? teamParticipant.team_id : null;
   }

   private getOpenedUserApplicationsObservable(userId: number): Observable<PaginatedResponse<TeamParticipant>> {
      const search: TeamParticipantSearch = {
         ended: ModelStatus.Falsy,
         limit: 1,
         page: 1,
         refused: ModelStatus.Falsy,
         userId
      };
      return this.teamParticipantService.getTeamParticipants(search);
   }

   private getPageData(competitionId: number): void {
      this.showCreateTeamButton = false;
      const requests: [ObservableInput<Competition>, ObservableInput<PaginatedResponse<Team>>] = [
         this.getCompetitionObservable(competitionId),
         this.getTeamsObservable(competitionId)
      ];
      forkJoin(requests)
         .pipe(
            map(([competitionResponse, teamsResponse]) => {
               return { competitionResponse, teamsResponse };
            }),
            mergeMap(response => {
               this.competition = response.competitionResponse;
               this.teams = response.teamsResponse.data;

               let applicationRequests: [
                  ObservableInput<PaginatedResponse<TeamParticipant>>,
                  ObservableInput<PaginatedResponse<TeamParticipant>>
               ] = [of(null), of(null)];
               if (this.user) {
                  applicationRequests = [
                     this.competition.state === CompetitionState.Applications
                        ? this.getOpenedUserApplicationsObservable(this.user.id)
                        : of(null),
                     this.getAllUserApplicationsObservable(competitionId, this.user.id)
                  ];
               }
               return forkJoin(applicationRequests).pipe(
                  map(([openedApplicationResponse, allApplicationsResponse]) => {
                     return { openedApplicationResponse, allApplicationsResponse };
                  })
               );
            })
         )
         .subscribe(response => {
            this.showCreateTeamButton = response.openedApplicationResponse && response.openedApplicationResponse.total < 1;
            this.allUserApplications = response.allApplicationsResponse ? response.allApplicationsResponse.data : [];
            this.currentUserTeamId = response.allApplicationsResponse
               ? this.getCurrentUserTeamId(response.allApplicationsResponse.data)
               : null;
         });
   }

   private getTeamsObservable(competitionId: number): Observable<PaginatedResponse<Team>> {
      const search: TeamSearch = {
         competitionId,
         orderBy: 'confirmed',
         sequence: Sequence.Ascending,
         limit: SettingsService.maxLimitValues.teamTeams,
         page: 1
      };
      return this.teamService.getTeams(search);
   }
}
