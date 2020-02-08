import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';

import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { UserNew } from '@models/new/user-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { TeamParticipantSearch } from '@models/search/team-participant-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthNewService } from '@services/new/auth-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { pick, remove } from 'lodash';

@Component({
   selector: 'app-team-and-participants',
   templateUrl: './team-and-participants.component.html',
   styleUrls: ['./team-and-participants.component.scss']
})
export class TeamAndParticipantsComponent implements OnInit, OnChanges {
   @Input() public team: TeamNew;
   @Input() public competition: CompetitionNew;
   @Input() public allUserApplications: TeamParticipantNew[];

   @Output() public teamParticipantCreated = new EventEmitter();

   public isExpanded: boolean;
   public openedModal: OpenedModal<{ message: string; teamParticipant: TeamParticipantNew }>;
   public showCaptainButtons: boolean;
   public showJoinButton: boolean;
   public teamParticipants: TeamParticipantNew[];
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamParticipantService: TeamParticipantNewService
   ) {}

   public confirmTeamParticipant(): void {
      const teamParticipant: TeamParticipantNew = { ...this.openedModal.data.teamParticipant, confirmed: true };
      const notificationMessage = `Заявку ${this.openedModal.data.teamParticipant.user.name} в команду ${this.team.name} прийнято`;
      this.updateTeamParticipant(teamParticipant, notificationMessage);
   }

   public createTeamParticipant(): void {
      const teamParticipant = {
         user_id: this.user.id,
         competition_id: this.competition.id,
         captain: false,
         team_id: this.team.id
      } as TeamParticipantNew;
      this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(
         () => {
            this.getTeamParticipants(this.competition.id, this.team.id);
            this.notificationsService.success('Успішно', `Заявку в команду ${this.team.name} подано`);
            this.isExpanded = true;
            this.showJoinButton = false;
            this.openedModal.reference.close();
            this.teamParticipantCreated.emit();
         },
         () => this.openedModal.reference.close()
      );
   }

   public deleteTeamParticipant(): void {
      this.teamParticipantService.deleteTeamParticipant(this.openedModal.data.teamParticipant.id).subscribe(
         () => {
            const notificationMessage = `Заявку ${this.openedModal.data.teamParticipant.user.name} в команду ${this.team.name} видалено`;
            this.notificationsService.success('Успішно', notificationMessage);
            remove(this.teamParticipants, this.openedModal.data.teamParticipant);
            this.openedModal.reference.close();
         },
         () => this.openedModal.reference.close()
      );
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes.allUserApplications && !changes.allUserApplications.firstChange) {
         this.showJoinButton = this.getShowJoinButton(this.team, this.competition, changes.allUserApplications.currentValue);
         this.showCaptainButtons = this.getShowCaptainButtons(this.team, this.competition);
      }
   }

   public ngOnInit(): void {
      this.user = this.authService.getUser();
   }

   public openConfirmModal(
      content: NgbModalRef | TemplateRef<any>,
      data: { message: string; teamParticipant: TeamParticipantNew },
      submitted: (event) => void
   ): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   public refuseTeamParticipant(): void {
      const teamParticipant: TeamParticipantNew = { ...this.openedModal.data.teamParticipant, refused: true };
      const notificationMessage = `Заявку ${this.openedModal.data.teamParticipant.user.name} в команду ${this.team.name} відхилено`;
      this.updateTeamParticipant(teamParticipant, notificationMessage);
   }

   public toggleParticipants(): void {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
         this.getTeamParticipants(this.competition.id, this.team.id);
      }
   }

   private getShowCaptainButtons(team: TeamNew, competition: CompetitionNew): boolean {
      if (!this.showAnyButton(team, competition)) {
         return false;
      }

      return this.user.id === team.captain_id;
   }

   private getShowJoinButton(team: TeamNew, competition: CompetitionNew, allUserApplications: TeamParticipantNew[]): boolean {
      if (!this.showAnyButton(team, competition)) {
         return false;
      }

      if (!allUserApplications.length) {
         return true;
      }

      if (allUserApplications.some(application => application.confirmed)) {
         return false;
      }

      return !allUserApplications.some(application => application.team_id === team.id);
   }

   private getTeamParticipants(competitionId: number, teamId: number): void {
      const search: TeamParticipantSearch = { competitionId, teamId, limit: SettingsService.maxLimitValues.teamParticipants, page: 1 };
      this.teamParticipantService.getTeamParticipants(search).subscribe(response => {
         this.teamParticipants = response.data;
      });
   }

   private showAnyButton(team: TeamNew, competition: CompetitionNew): boolean {
      if (!this.user) {
         return false;
      }

      if (!competition.stated) {
         return false;
      }

      if (!team.stated) {
         return false;
      }

      return true;
   }

   private updateTeamParticipant(teamParticipant: TeamParticipantNew, notificationMessage: string): void {
      const participant = pick(teamParticipant, ['team_id', 'user_id', 'competition_id', 'captain', 'confirmed', 'refused', 'ended']);
      this.teamParticipantService.updateTeamParticipant(teamParticipant.id, participant).subscribe(
         response => {
            this.notificationsService.success('Успішно', notificationMessage);
            this.openedModal.reference.close();
            const index = this.teamParticipants.findIndex(t => t.id === response.id);
            if (index > -1) {
               this.teamParticipants[index] = response;
            }
            if (response.confirmed) {
               this.updateTeamState();
            }
         },
         () => this.openedModal.reference.close()
      );
   }

   private updateTeamState(): void {
      const totalConfirmed = this.teamParticipants.reduce((total, teamParticipant) => {
         return teamParticipant.confirmed ? total + 1 : total;
      }, 0);
      if (totalConfirmed === SettingsService.participantsInTeam) {
         this.team.stated = false;
         this.team.confirmed = true;
      }
   }
}
