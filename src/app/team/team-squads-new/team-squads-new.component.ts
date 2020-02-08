import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { UserNew } from '@models/new/user-new.model';
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
import { map, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
   selector: 'app-team-squads-new',
   templateUrl: './team-squads-new.component.html',
   styleUrls: ['./team-squads-new.component.scss']
})
export class TeamSquadsNewComponent implements OnDestroy, OnInit {
   public allUserApplications: TeamParticipantNew[];
   public competition: CompetitionNew;
   public openedModal: OpenedModal<null>;
   public showCreateTeamButton: boolean;
   public teams: TeamNew[];
   public user: UserNew;

   private destroyed$ = new Subject();

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private competitionService: CompetitionNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamCompetitionService: TeamCompetitionNewService,
      private teamParticipantService: TeamParticipantNewService,
      private teamService: TeamNewService,
      private titleService: TitleService
   ) {}

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
      this.activatedRoute.parent.params.pipe(takeUntil(this.destroyed$)).subscribe((params: Params) => {
         this.getPageData(params.competitionId);
      });
   }

   public openTeamSelectModal(content: NgbModalRef | TemplateRef<any>): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data: null, submitted: () => {} };
   }

   public teamSelected(team: TeamNew): void {
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

   private getAllUserApplicationsObservable(competitionId: number, userId): Observable<PaginatedResponse<TeamParticipantNew>> {
      const search: TeamParticipantSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.teamParticipants,
         competitionId,
         userId
      };
      return this.teamParticipantService.getTeamParticipants(search);
   }

   private getCompetitionObservable(id: number): Observable<{ competition: CompetitionNew }> {
      return this.competitionService.getCompetition(id);
   }

   private getOpenedUserApplicationsObservable(userId: number): Observable<PaginatedResponse<TeamParticipantNew>> {
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
      const requests: [ObservableInput<{ competition: CompetitionNew }>, ObservableInput<PaginatedResponse<TeamNew>>] = [
         this.getCompetitionObservable(competitionId),
         this.getTeamsObservable(competitionId)
      ];
      forkJoin(requests)
         .pipe(
            map(([competitionResponse, teamsResponse]) => {
               return { competitionResponse, teamsResponse };
            }),
            mergeMap(response => {
               this.competition = response.competitionResponse.competition;
               this.teams = response.teamsResponse.data;

               let applicationRequests: [
                  ObservableInput<PaginatedResponse<TeamParticipantNew>>,
                  ObservableInput<PaginatedResponse<TeamParticipantNew>>
               ] = [of(null), of(null)];
               if (this.user && this.competition.stated) {
                  applicationRequests = [
                     this.getOpenedUserApplicationsObservable(this.user.id),
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
            this.allUserApplications = response.openedApplicationResponse ? response.allApplicationsResponse.data : [];
         });
   }

   private getTeamsObservable(competitionId: number): Observable<PaginatedResponse<TeamNew>> {
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
