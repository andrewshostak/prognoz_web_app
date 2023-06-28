import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { Pagination } from '@models/pagination.model';
import { TeamStageSearch } from '@models/search/team/team-stage-search.model';
import { TeamStageService } from '@services/v2/team/team-stage.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';

import { Subscription } from 'rxjs';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { OpenedModal } from '@models/opened-modal.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { findIndex } from 'lodash';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-stages-table',
   templateUrl: './team-stages-table.component.html',
   styleUrls: ['./team-stages-table.component.scss']
})
export class TeamStagesTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public openedModal: OpenedModal<TeamStage>;
   public paginationData: Pagination;
   public teamStages: TeamStage[] = [];
   public teamStageTypes = TeamStageState;

   constructor(
      private activatedRoute: ActivatedRoute,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamStageService: TeamStageService
   ) {}

   public makeTeamStageActive(notStarted: TeamStage): void {
      const teamStage = { ...notStarted, state: TeamStageState.Active };
      this.teamStageService.updateTeamStage(teamStage.id, teamStage).subscribe(
         response => {
            const index = findIndex(this.teamStages, { id: teamStage.id });
            if (index > -1) {
               this.teamStages.splice(index, 1, response);
               this.notificationsService.success('Успішно', `Командна стадія ${this.openedModal.data.title} активна`);
            }
            this.openedModal.reference.close();
         },
         () => this.openedModal.reference.close()
      );
   }

   public makeTeamStageEnded(active: TeamStage): void {
      const teamStage = { ...active, state: TeamStageState.Ended };
      this.teamStageService.updateTeamStage(teamStage.id, teamStage).subscribe(
         response => {
            const index = findIndex(this.teamStages, { id: teamStage.id });
            if (index > -1) {
               this.teamStages.splice(index, 1, response);
               this.notificationsService.success('Успішно', `Командна стадія ${this.openedModal.data.title} завершена`);
            }
            this.openedModal.reference.close();
         },
         () => this.openedModal.reference.close()
      );
   }

   public getTeamStagesData(pageNumber: number): void {
      const search: TeamStageSearch = {
         page: pageNumber,
         orderBy: 'state',
         limit: PaginationService.perPage.teamsStages,
         sequence: Sequence.Ascending,
         relations: ['competition', 'teamStageType']
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = response.data;
         this.paginationData = PaginationService.getPaginationData<TeamStage>(response, '/manage/team/stages/page/');
      });
   }

   public ngOnDestroy(): void {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit(): void {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getTeamStagesData(params.pageNumber);
      });
   }

   public openActivateConfirm(content: NgbModalRef | TemplateRef<Element>, data: TeamStage, submitted: (event) => void): void {
      const message = `Активувати стадію ${data.title}?`;
      this.openConfirmModal(content, data, submitted, message);
   }

   public openEndConfirm(content: NgbModalRef | TemplateRef<Element>, data: TeamStage, submitted: (event) => void): void {
      const message = `Завершити стадію ${data.title}?`;
      this.openConfirmModal(content, data, submitted, message);
   }

   private openConfirmModal(
      content: NgbModalRef | TemplateRef<Element>,
      data: TeamStage,
      submitted: (event) => void,
      message: string
   ): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this), message };
   }
}
