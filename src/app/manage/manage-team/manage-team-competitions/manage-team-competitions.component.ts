import { Component, OnInit, TemplateRef } from '@angular/core';

import { ModelStatus } from '@enums/model-status.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionService } from '@services/competition.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CompetitionUtilsService } from '@services/new/competition-utils.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { findIndex } from 'lodash';

@Component({
   selector: 'app-manage-team-competitions',
   templateUrl: './manage-team-competitions.component.html',
   styleUrls: ['./manage-team-competitions.component.scss']
})
export class ManageTeamCompetitionsComponent implements OnInit {
   public openedModal: OpenedModal<{ competition: CompetitionNew; message: string }>;
   public competitions: Array<{
      totalNumberOfRounds: number;
      competition: CompetitionNew;
      isUpdated: boolean;
      buttonText: string;
      stateText: string;
      modal: {
         confirmText: string;
         callback: () => any;
      };
   }> = [];

   constructor(
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService,
      private ngbModalService: NgbModal,
      private oldCompetitionService: CompetitionService
   ) {}

   public ngOnInit(): void {
      this.getCompetitionsData();
   }

   public openConfirmModal(
      content: NgbModalRef | TemplateRef<any>,
      data: { competition: CompetitionNew; message: string },
      submitted: (event) => void
   ): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   private changeRound(): void {
      const competitionToUpdate = Object.assign({}, this.openedModal.data.competition);
      competitionToUpdate.active_round = CompetitionUtilsService.getTeamNextRoundNumber(this.openedModal.data.competition);
      this.updateCompetition(competitionToUpdate, 'Розпочато наступний раунд');
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         ended: ModelStatus.Falsy,
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = response.data.map(competition => this.mapCompetitionWithDetails(competition));
      });
   }

   private getTemplateData(
      competition: CompetitionNew,
      totalNumberOfRounds: number
   ): { buttonText: string; stateText: string; modal: { confirmText: string; callback: () => any } } {
      switch (true) {
         case Boolean(competition.stated && !competition.active):
            return {
               buttonText: 'Провести жеребкування',
               stateText: 'Відкрито заявки',
               modal: {
                  confirmText: `${competition.title}: провести жеребкування?`,
                  callback: this.makeDraw
               }
            };
         case Boolean(!competition.stated && competition.active):
            return {
               buttonText:
                  competition.active_round === totalNumberOfRounds
                     ? `Завершити ${totalNumberOfRounds} тур`
                     : `Розпочати ${competition.active_round ? competition.active_round + 1 : 1} тур`,
               stateText: 'Активне змагання',
               modal: {
                  confirmText:
                     competition.active_round === totalNumberOfRounds
                        ? `${competition.title}: завершити останній (${totalNumberOfRounds}) тур?`
                        : `${competition.title}: змінити активний тур (${competition.active_round || 0} на ${competition.active_round +
                             1})?`,
                  callback: this.changeRound
               }
            };
         case Boolean(!competition.stated && !competition.active):
            return {
               buttonText: 'Відкрити заявки',
               stateText: 'Неактивне змагання',
               modal: {
                  confirmText: `${competition.title}: відкрити заявки?`,
                  callback: this.openApplications
               }
            };
         default:
            return null;
      }
   }

   private makeDraw(): void {
      const competitionToUpdate = Object.assign({}, this.openedModal.data.competition);
      competitionToUpdate.stated = ModelStatus.Falsy;
      competitionToUpdate.active = ModelStatus.Truthy;
      this.updateCompetition(competitionToUpdate as any, 'Проведено жеребкування календаря');
   }

   private mapCompetitionWithDetails(
      competition: CompetitionNew,
      isUpdated = false
   ): {
      totalNumberOfRounds: number;
      competition: CompetitionNew;
      isUpdated: boolean;
      buttonText: string;
      stateText: string;
      modal: { confirmText: string; callback: () => any };
   } {
      const totalNumberOfRounds = CompetitionUtilsService.getTotalNumberOfRounds(competition.number_of_teams);
      const data = this.getTemplateData(competition, totalNumberOfRounds);
      return { competition, totalNumberOfRounds, ...data, isUpdated };
   }

   private openApplications(): void {
      const competitionToUpdate = Object.assign({}, this.openedModal.data.competition);
      competitionToUpdate.stated = ModelStatus.Truthy;
      this.updateCompetition(competitionToUpdate, 'Відкрито подачу заявок');
   }

   private updateCompetition(competition: CompetitionNew, message: string): void {
      this.oldCompetitionService.updateCompetition(competition as any, competition.id).subscribe(
         response => {
            this.openedModal.reference.close();
            this.notificationsService.success('Успішно', message);
            this.updateCompetitionInTheList(response as any);
         },
         errors => {
            this.openedModal.reference.close();
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }

   private updateCompetitionInTheList(competition: CompetitionNew): void {
      const foundIndex = findIndex(this.competitions, c => c.competition.id === competition.id);
      if (foundIndex < 0) {
         return;
      }

      this.competitions[foundIndex] = this.mapCompetitionWithDetails(competition, true);
   }
}
