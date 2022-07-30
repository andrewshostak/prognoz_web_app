import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';

import { CompetitionState } from '@enums/competition-state.enum';
import { CupApplicationPlace } from '@enums/cup-application-place.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { Competition } from '@models/competition.model';
import { CupApplication } from '@models/cup/cup-application.model';
import { UserNew } from '@models/new/user-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CupApplicationService } from '@services/cup/cup-application.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-cup-applications',
   templateUrl: './cup-applications.component.html',
   styleUrls: ['./cup-applications.component.scss']
})
export class CupApplicationsComponent implements OnInit {
   public competitions: CompetitionNew[];
   public confirmModalMessage: string;
   public confirmModalSubmit: (event) => void;
   public selectedCompetitionForNewApplication: Competition;
   public selectedCupApplication: Partial<CupApplication>;
   public competitionStates = CompetitionState;

   private applicationModalReference: NgbModalRef;
   private authenticatedUser: UserNew;
   private confirmModalReference: NgbModalRef;
   private cupApplications: CupApplication[];
   private errorCupApplications: string;

   constructor(
      private authNewService: AuthNewService,
      private competitionService: CompetitionNewService,
      private cupApplicationService: CupApplicationService,
      private elementRef: ElementRef,
      private notificationsService: NotificationsService,
      private ngbModalService: NgbModal,
      private titleService: TitleService
   ) {}

   public applicationModalSubmitted(): void {
      this.closeModal(this.applicationModalReference);
      this.selectedCompetitionForNewApplication = null;
      this.selectedCupApplication = null;
      this.getApplicationsAndCompetitions();
   }

   public getApplicationsAndCompetitions(): void {
      const cupApplications = this.cupApplicationService.getCupApplications();
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Cup
      };
      const competitions = this.competitionService.getCompetitions(search);

      forkJoin([cupApplications, competitions]).subscribe(
         response => {
            this.cupApplications = response[0]
               ? response[0].sort((a, b) => {
                    return a.points > b.points ? -1 : 1;
                 })
               : [];
            this.competitions = response[1] ? response[1].data : [];
            this.attachApplicationsToCompetitions();
         },
         error => {
            this.errorCupApplications = error;
         }
      );
   }

   public getPlaceTitle(place: CupApplicationPlace): string {
      switch (place) {
         case CupApplicationPlace.Home:
            return SettingsService.cupApplicationPlaces[0].title;
         case CupApplicationPlace.Away:
            return SettingsService.cupApplicationPlaces[1].title;
         case CupApplicationPlace.Anywhere:
            return SettingsService.cupApplicationPlaces[2].title;
      }
   }

   public isFriendlyCompetition(competition: Competition | CompetitionNew): boolean {
      return !competition.participants;
   }

   public hasAddApplicationAbility(competition: Competition): boolean {
      if (!this.authenticatedUser) {
         return false;
      }

      return (
         this.authenticatedUser &&
         !this.hasRefusedApplication(competition, this.authenticatedUser) &&
         !this.hasUnConfirmedRequisition(this.authenticatedUser) &&
         !this.hasConfirmedRequisitionAsApplicant(this.authenticatedUser) &&
         !this.hasConfirmedRequisitionAsReceiver(this.authenticatedUser) &&
         competition.state === CompetitionState.Applications
      );
   }

   public hasModeratorRights(): boolean {
      return this.authNewService.hasPermissions(['create_cup_application_wo_validation', 'update_cup_application_wo_validation']);
   }

   public ngOnInit(): void {
      this.titleService.setTitle('Заявки / Учасники - Кубок');
      this.authenticatedUser = this.authNewService.getUser();
      this.getApplicationsAndCompetitions();
   }

   public onClick(competition: Competition): void {
      const element = this.elementRef.nativeElement.querySelector(`#competition-${competition.id}`);
      if (element) {
         element.scrollIntoView();
      }
   }

   public openApplicationModal(content: NgbModalRef | TemplateRef<any>, competition: Competition, cupApplication?: CupApplication): void {
      this.selectedCompetitionForNewApplication = competition;
      if (!cupApplication) {
         this.selectedCupApplication = {
            competition_id: competition.id,
            applicant_id: this.authenticatedUser.id,
            place: this.isFriendlyCompetition(competition) ? CupApplicationPlace.Anywhere : null
         };
      } else {
         this.selectedCupApplication = {
            id: cupApplication.id,
            competition_id: cupApplication.competition_id,
            applicant_id: cupApplication.applicant_id,
            receiver_id: cupApplication.receiver_id,
            place: cupApplication.place
         };
      }
      this.applicationModalReference = this.ngbModalService.open(content);
   }

   public openAcceptApplicationConfirmModal(content: NgbModalRef | TemplateRef<any>, cupApplication: CupApplication): void {
      this.confirmModalMessage = `Підтвердити заявку ${cupApplication.applicant.name}?`;
      this.confirmModalSubmit = () => this.confirmApplication(cupApplication);
      this.confirmModalReference = this.ngbModalService.open(content);
   }

   public openDeleteApplicationConfirmModal(
      content: NgbModalRef | TemplateRef<any>,
      cupApplication: CupApplication,
      competition: Competition
   ): void {
      this.confirmModalMessage = `Видалити заявку ${cupApplication.applicant.name}?`;
      this.confirmModalSubmit = () => this.deleteCupApplication(cupApplication, competition);
      this.confirmModalReference = this.ngbModalService.open(content);
   }

   public openRefuseApplicationConfirmModal(content: NgbModalRef | TemplateRef<any>, cupApplication: CupApplication): void {
      this.confirmModalMessage = `Відхилити заявку ${cupApplication.applicant.name}?`;
      this.confirmModalSubmit = () => this.refuseApplication(cupApplication);
      this.confirmModalReference = this.ngbModalService.open(content);
   }

   public showPointsColumn(competition: Competition | CompetitionNew): boolean {
      if (this.isFriendlyCompetition(competition)) {
         return false;
      }

      return competition.state === CompetitionState.Active || competition.state === CompetitionState.Ended;
   }

   public showActionButtons(competition: Competition, cupApplication: CupApplication): boolean {
      if (!this.authenticatedUser) {
         return false;
      }
      if (this.hasConfirmedRequisitionAsApplicant(this.authenticatedUser) && !this.hasModeratorRights()) {
         return false;
      }
      if (this.hasConfirmedRequisitionAsReceiver(this.authenticatedUser) && !this.hasModeratorRights()) {
         return false;
      }
      if (this.authenticatedUser.id === cupApplication.applicant_id && !this.hasModeratorRights()) {
         return false;
      }
      if (cupApplication.confirmed_at || cupApplication.refused_at) {
         return false;
      }
      if (this.isFriendlyCompetition(competition)) {
         if (!cupApplication.receiver_id) {
            return true;
         } else if (cupApplication.receiver_id === this.authenticatedUser.id) {
            return true;
         }
      } else {
         return this.hasModeratorRights();
      }
      return false;
   }

   public showEditAndDeleteButtons(competition: Competition, cupApplication: CupApplication): boolean {
      if (!this.authenticatedUser) {
         return false;
      }
      if (competition.state !== CompetitionState.Applications) {
         return false;
      }
      if (this.authenticatedUser.id === cupApplication.applicant_id || this.hasModeratorRights()) {
         if (!cupApplication.confirmed_at && !cupApplication.refused_at && !cupApplication.ended) {
            return true;
         }
      }
      return false;
   }

   public showRefuseButton(cupApplication: CupApplication): boolean {
      if (this.hasModeratorRights() && !this.isFriendlyCompetition(cupApplication.competition)) {
         return true;
      }
      return !!cupApplication.receiver_id;
   }

   private attachApplicationsToCompetitions(): void {
      if (this.competitions.length && !this.noCupApplications()) {
         const grouped = UtilsService.groupBy(this.cupApplications, cupApplication => cupApplication.competition_id);
         this.competitions.map(competition => {
            return (competition.cup_applications = grouped.get(competition.id));
         });
      }
   }

   private closeModal(modalReference: NgbModalRef): void {
      modalReference.close();
      modalReference = null;
   }

   private confirmApplication(cupApplication: CupApplication): void {
      const updateRequestData = {
         competition_id: cupApplication.competition_id,
         receiver_id: this.authenticatedUser.id,
         confirmed: true
      };
      this.cupApplicationService.updateCupApplication(updateRequestData, cupApplication.id).subscribe(
         () => {
            this.getApplicationsAndCompetitions();
            this.closeModal(this.confirmModalReference);
            this.notificationsService.success('Успішно', 'Заявку підтверджено');
         },
         error => {
            this.getApplicationsAndCompetitions();
            this.closeModal(this.confirmModalReference);
            this.notificationsService.error('Помилка', error);
         }
      );
   }

   private deleteCupApplication(cupApplication: CupApplication, competition: Competition): void {
      if (!this.showEditAndDeleteButtons(competition, cupApplication)) {
         return;
      }

      this.cupApplicationService.deleteCupApplication(cupApplication.id).subscribe(
         () => {
            this.getApplicationsAndCompetitions();
            this.closeModal(this.confirmModalReference);
            this.notificationsService.success('Успішно', 'Заявку видалено');
         },
         error => {
            this.getApplicationsAndCompetitions();
            this.closeModal(this.confirmModalReference);
            this.notificationsService.error('Помилка', error);
         }
      );
   }

   private hasConfirmedRequisitionAsReceiver(receiver: UserNew): boolean {
      if (this.noCupApplications()) {
         return false;
      }
      return this.cupApplications.some(cupApplication => cupApplication.receiver_id === receiver.id && !!cupApplication.confirmed_at);
   }

   private hasConfirmedRequisitionAsApplicant(applicant: UserNew): boolean {
      if (this.noCupApplications()) {
         return false;
      }
      return this.cupApplications.some(cupApplication => cupApplication.applicant_id === applicant.id && !!cupApplication.confirmed_at);
   }

   private hasRefusedApplication(competition: Competition, applicant: UserNew): boolean {
      if (this.noCupApplications()) {
         return false;
      }
      return (
         !this.isFriendlyCompetition(competition) &&
         this.cupApplications.some(cupApplication => {
            return cupApplication.applicant_id === applicant.id && !!cupApplication.refused_at;
         })
      );
   }

   private hasUnConfirmedRequisition(applicant: UserNew): boolean {
      if (this.noCupApplications()) {
         return false;
      }
      return this.cupApplications.some(cupApplication => {
         return cupApplication.applicant_id === applicant.id && !cupApplication.confirmed_at && !cupApplication.refused_at;
      });
   }

   private noCupApplications(): boolean {
      return !this.cupApplications || !this.cupApplications.length;
   }

   private refuseApplication(cupApplication: CupApplication): void {
      const updateRequestData = {
         competition_id: cupApplication.competition_id,
         refused: true
      };
      this.cupApplicationService.updateCupApplication(updateRequestData, cupApplication.id).subscribe(
         () => {
            this.getApplicationsAndCompetitions();
            this.closeModal(this.confirmModalReference);
            this.notificationsService.success('Успішно', 'Заявку відхилено');
         },
         error => {
            this.getApplicationsAndCompetitions();
            this.closeModal(this.confirmModalReference);
            this.notificationsService.error('Помилка', error);
         }
      );
   }
}
