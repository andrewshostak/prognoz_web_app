import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';

import { CompetitionState } from '@enums/competition-state.enum';
import { CupApplicationDefaultState } from '@enums/cup-application-default-state.enum';
import { OpenedModal } from '@models/opened-modal.model';
import { CupApplicationNew } from '@models/v2/cup-application-new.model';
import { CompetitionNew } from '@models/v2/competition-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { CupApplicationNewService } from '@services/new/cup-application-new.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-cup-applications-default',
   templateUrl: './cup-applications-default.component.html'
})
export class CupApplicationsDefaultComponent implements OnChanges, OnInit {
   @Input() cupApplications: CupApplicationNew[];
   @Input() competition: CompetitionNew;

   cupApplicationState = CupApplicationDefaultState;
   cupApplicationsView: {
      application: CupApplicationNew;
      state: CupApplicationDefaultState;
      showDeleteButton: boolean;
      showConfirmButton: boolean;
   }[] = [];
   isActiveOrEndedCompetition: boolean = false;
   isCreateButtonVisible: boolean = false;
   isActionColumnVisible: boolean = false;
   openedModal: OpenedModal<Partial<CupApplicationNew>>;

   private authenticatedUser;
   private hasModeratorRights: boolean = false;

   constructor(
      private authService: AuthNewService,
      private cupApplicationService: CupApplicationNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   applicationModalSubmitted(cupApplication: CupApplicationNew): void {
      this.openedModal.reference.close();
      this.openedModal = null;
      this.cupApplications.push(cupApplication);
      this.updateView();
   }

   ngOnChanges(changes: SimpleChanges) {
      if (changes.competition && changes.competition.currentValue) {
         this.isActiveOrEndedCompetition = [CompetitionState.Active, CompetitionState.Ended].includes(this.competition.state);
      }
      if (changes.cupApplications && changes.cupApplications.currentValue) {
         this.updateView();
      }
   }

   ngOnInit() {
      this.authenticatedUser = this.authService.getUser();
      this.hasModeratorRights = this.authService.hasPermissions([
         'create_cup_application_wo_validation',
         'update_cup_application_wo_validation'
      ]);
   }

   openApplicationModal(content: NgbModalRef | TemplateRef<any>): void {
      this.openedModal = {
         data: {
            competition_id: this.competition.id,
            applicant_id: this.authenticatedUser.id
         },
         submitted: () => {},
         reference: this.ngbModalService.open(content, { centered: true })
      };
   }

   openAcceptApplicationConfirmModal(content: NgbModalRef | TemplateRef<any>, cupApplication: CupApplicationNew): void {
      this.openedModal = {
         data: cupApplication,
         message: `Підтвердити заявку ${cupApplication.applicant.name}?`,
         submitted: () => this.confirmApplication(cupApplication),
         reference: this.ngbModalService.open(content)
      };
   }

   openDeleteApplicationConfirmModal(content: NgbModalRef | TemplateRef<any>, cupApplication: CupApplicationNew): void {
      this.openedModal = {
         data: cupApplication,
         message: `Видалити заявку ${cupApplication.applicant.name}?`,
         submitted: () => this.deleteCupApplication(cupApplication),
         reference: this.ngbModalService.open(content)
      };
   }

   private confirmApplication(cupApplication: CupApplicationNew): void {
      this.cupApplicationService.updateCupApplication(cupApplication.id, CupApplicationDefaultState.Active).subscribe(
         response => {
            this.openedModal.reference.close();
            this.notificationsService.success('Успішно', 'Заявку підтверджено');
            const index = this.cupApplications.findIndex(application => application.id === cupApplication.id);
            this.cupApplications[index] = { ...this.cupApplications[index], ...response };
            this.updateView();
         },
         error => {
            this.openedModal.reference.close();
            this.notificationsService.error('Помилка', error);
         }
      );
   }

   private getCupApplicationState(cupApplication: CupApplicationNew): CupApplicationDefaultState {
      if (cupApplication.ended) {
         return CupApplicationDefaultState.Terminated;
      }

      if (!cupApplication.confirmed_at && !cupApplication.refused_at) {
         return CupApplicationDefaultState.Opened;
      }

      if (cupApplication.confirmed_at && !cupApplication.refused_at) {
         return CupApplicationDefaultState.Active;
      }

      if (!cupApplication.confirmed_at && cupApplication.refused_at) {
         return CupApplicationDefaultState.Terminated;
      }
   }

   private deleteCupApplication(cupApplication: CupApplicationNew): void {
      this.cupApplicationService.deleteCupApplication(cupApplication.id).subscribe(
         () => {
            this.openedModal.reference.close();
            this.notificationsService.success('Успішно', 'Заявку видалено');
            this.cupApplications = this.cupApplications.filter(application => application.id !== cupApplication.id);
            this.updateView();
         },
         () => this.openedModal.reference.close()
      );
   }

   private showActionColumn(
      cupApplications: CupApplicationNew[],
      competition: CompetitionNew,
      authenticatedUser: UserNew,
      hasModeratorRights: boolean
   ): boolean {
      if (!authenticatedUser) {
         return false;
      }

      if (competition.state === CompetitionState.Ended) {
         return false;
      }

      if (hasModeratorRights) {
         return true;
      }

      if (competition.state !== CompetitionState.Applications) {
         return false;
      }

      return cupApplications.some(application => application.applicant_id === authenticatedUser.id);
   }

   private showCreateButton(
      cupApplications: CupApplicationNew[],
      competition: CompetitionNew,
      authenticatedUser: UserNew,
      hasModeratorRights: boolean
   ): boolean {
      if (!authenticatedUser) {
         return false;
      }

      if (competition.state === CompetitionState.Ended) {
         return false;
      }

      if (hasModeratorRights) {
         return true;
      }

      if (competition.state !== CompetitionState.Applications) {
         return false;
      }

      return !cupApplications.map(application => application.applicant_id).includes(authenticatedUser.id);
   }

   private showConfirmButton(
      cupApplication: CupApplicationNew,
      competition: CompetitionNew,
      authenticatedUser: UserNew,
      hasModeratorRights: boolean
   ): boolean {
      if (!authenticatedUser) {
         return false;
      }

      if (competition.state !== CompetitionState.Applications) {
         return false;
      }

      if (cupApplication.confirmed_at || cupApplication.refused_at || cupApplication.ended) {
         return false;
      }

      return hasModeratorRights;
   }

   private showDeleteButton(
      cupApplication: CupApplicationNew,
      competition: CompetitionNew,
      authenticatedUser: UserNew,
      hasModeratorRights: boolean
   ): boolean {
      if (!authenticatedUser) {
         return false;
      }

      if (hasModeratorRights) {
         return [CompetitionState.Applications, CompetitionState.Active].includes(competition.state);
      }

      if ([CompetitionState.Active, CompetitionState.Ended].includes(competition.state)) {
         return false;
      }

      return cupApplication.applicant_id === authenticatedUser.id;
   }

   private sortCupApplications(
      cupApplications: CupApplicationNew[],
      competition: CompetitionNew,
      authenticatedUser: UserNew
   ): CupApplicationNew[] {
      switch (competition.state) {
         case CompetitionState.Applications:
            return cupApplications.sort((a, b) => {
               if (authenticatedUser) {
                  if (a.applicant_id === authenticatedUser.id) {
                     return -1;
                  }
                  if (b.applicant_id === authenticatedUser.id) {
                     return 1;
                  }
               }
               return a.created_at > b.created_at ? 1 : -1;
            });
         case CompetitionState.Active:
            return cupApplications.sort((a, b) => (a.points > b.points ? -1 : 1));
         default:
            return cupApplications;
      }
   }

   private updateView(): void {
      this.cupApplicationsView = this.sortCupApplications(this.cupApplications, this.competition, this.authenticatedUser).map(
         application => {
            return {
               application,
               state: this.getCupApplicationState(application),
               showDeleteButton: this.showDeleteButton(application, this.competition, this.authenticatedUser, this.hasModeratorRights),
               showConfirmButton: this.showConfirmButton(application, this.competition, this.authenticatedUser, this.hasModeratorRights)
            };
         }
      );
      this.isCreateButtonVisible = this.showCreateButton(
         this.cupApplications,
         this.competition,
         this.authenticatedUser,
         this.hasModeratorRights
      );
      this.isActionColumnVisible = this.showActionColumn(
         this.cupApplications,
         this.competition,
         this.authenticatedUser,
         this.hasModeratorRights
      );
   }
}
