import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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

@Component({
   selector: 'app-team-and-participants',
   templateUrl: './team-and-participants.component.html',
   styleUrls: ['./team-and-participants.component.scss']
})
export class TeamAndParticipantsComponent implements OnInit, OnChanges {
   @Input() public team: TeamNew;
   @Input() public competition: CompetitionNew;
   @Input() public allUserApplications: TeamParticipantNew[];

   public isExpanded: boolean;
   public openedModal: OpenedModal<{ message: string; teamParticipant: TeamParticipantNew }>;
   public showJoinButton: boolean;
   public teamParticipants: TeamParticipantNew[];
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamParticipantService: TeamParticipantNewService
   ) {}

   public createTeamParticipant(): void {
      const teamParticipant = {
         user_id: this.user.id,
         competition_id: this.competition.id,
         captain: false,
         team_id: this.team.id
      } as TeamParticipantNew;
      this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(() => {
         this.getTeamParticipants(this.competition.id, this.team.id);
         this.notificationsService.success('Успішно', `Заявку в команду ${this.team.name} подано`);
         this.isExpanded = true;
         this.showJoinButton = false;
         this.openedModal.reference.close();
      });
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes.allUserApplications && !changes.allUserApplications.firstChange) {
         this.showJoinButton = this.getShowJoinButton(this.team, this.competition, changes.allUserApplications.currentValue);
      }
   }

   public ngOnInit(): void {
      this.user = this.authService.getUser();
   }

   public openConfirmModal(
      content: NgbModalRef,
      data: { message: string; teamParticipant: TeamParticipantNew },
      submitted: (event) => void
   ): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   public toggleParticipants(): void {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
         this.getTeamParticipants(this.competition.id, this.team.id);
      }
   }

   private getTeamParticipants(competitionId: number, teamId: number): void {
      const search: TeamParticipantSearch = { competitionId, teamId, limit: SettingsService.maxLimitValues.teamParticipants, page: 1 };
      this.teamParticipantService.getTeamParticipants(search).subscribe(response => {
         this.teamParticipants = response.data;
      });
   }

   private getShowJoinButton(team: TeamNew, competition: CompetitionNew, allUserApplications: TeamParticipantNew[]): boolean {
      if (!this.user) {
         return false;
      }

      if (!competition.stated) {
         return false;
      }

      if (!team.stated) {
         return false;
      }

      if (!allUserApplications.length) {
         return true;
      }

      if (allUserApplications.some(application => application.confirmed)) {
         return false;
      }

      if (allUserApplications.some(application => application.team_id === team.id)) {
         return false;
      }

      return true;
   }

   // todo: buttons
   //  Підтвердження заявки капітаном
   //  Відхилення заявки капітаном
   //  Видалення відхиленої заявки капітаном
}
