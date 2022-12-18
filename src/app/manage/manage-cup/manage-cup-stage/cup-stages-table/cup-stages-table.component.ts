import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupStageState } from '@enums/cup-stage-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { CupStageNew } from '@models/new/cup-stage-new.model';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { SettingsService } from '@services/settings.service';
import { OpenedModal } from '@models/opened-modal.model';
import { findIndex, remove } from 'lodash';
import { Pagination } from '@models/pagination.model';
import { PaginationService } from '@services/pagination.service';

@Component({
   selector: 'app-cup-stages-table',
   templateUrl: './cup-stages-table.component.html',
   styleUrls: ['./cup-stages-table.component.scss']
})
export class CupStagesTableComponent implements OnInit, OnDestroy {
   public activatedRouteSubscription: Subscription;
   public cupStages: CupStageNew[];
   public cupStageStates = CupStageState;
   public openedModal: OpenedModal<CupStageNew>;
   public paginationData: Pagination;
   public path = '/manage/cup/stages/page/';

   constructor(
      private activatedRoute: ActivatedRoute,
      private cupStageService: CupStageService,
      private cupStageNewService: CupStageNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   public deleteCupStage(): void {
      this.cupStageNewService.deleteCupStage(this.openedModal.data.id).subscribe(
         () => {
            remove(this.cupStages, this.openedModal.data);
            this.paginationData.total--;
            this.notificationsService.success('Успішно', `Кубкову стадію ${this.openedModal.data.title} видалено`);
            this.openedModal.reference.close();
         },
         () => this.openedModal.reference.close()
      );
   }

   public makeCupStageActive(notStarted: CupStageNew): void {
      const cupStage = { ...notStarted, state: CupStageState.Active };
      this.cupStageService.updateCupStage((cupStage as any) as CupStage, cupStage.id).subscribe(
         response => {
            const index = findIndex(this.cupStages, { id: cupStage.id });
            if (index > -1) {
               // todo: replace the whole object after migration to v2
               this.cupStages[index].state = response.state;
               this.notificationsService.success('Успішно', `Кубкова стадія ${this.openedModal.data.title} активна`);
            }
            this.openedModal.reference.close();
         },
         () => this.openedModal.reference.close()
      );
   }

   public makeCupStageEnded(active: CupStageNew): void {
      const cupStage = { ...active, state: CupStageState.Ended };
      this.cupStageService.updateCupStage((cupStage as any) as CupStage, cupStage.id).subscribe(
         response => {
            const index = findIndex(this.cupStages, { id: cupStage.id });
            if (index > -1) {
               // todo: replace the whole object after migration to v2
               this.cupStages[index].state = response.state;
               this.notificationsService.success('Успішно', `Кубкова стадія ${this.openedModal.data.title} завершена`);
            }
            this.openedModal.reference.close();
         },
         () => this.openedModal.reference.close()
      );
   }

   public ngOnDestroy() {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit() {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         const search: CupStageSearch = {
            page: params.number,
            limit: SettingsService.cupStagesPerPage,
            orderBy: 'state',
            sequence: Sequence.Ascending,
            relations: ['competition', 'cupStageType']
         };
         this.cupStageNewService.getCupStages(search).subscribe(response => {
            this.cupStages = response.data;
            this.paginationData = PaginationService.getPaginationData(response, this.path);
         });
      });
   }

   public openActivateConfirm(content: NgbModalRef | TemplateRef<any>, data: CupStageNew, submitted: (event) => void): void {
      const message = `Активувати стадію ${data.title}?`;
      this.openConfirmModal(content, data, submitted, message);
   }

   public openDeleteConfirm(content: NgbModalRef | TemplateRef<any>, data: CupStageNew, submitted: (event) => void): void {
      const message = `Ви впевнені що хочете видалити ${data.title}?`;
      this.openConfirmModal(content, data, submitted, message);
   }

   public openEndConfirm(content: NgbModalRef | TemplateRef<any>, data: CupStageNew, submitted: (event) => void): void {
      const message = `Завершити стадію ${data.title}?`;
      this.openConfirmModal(content, data, submitted, message);
   }

   private openConfirmModal(content: NgbModalRef | TemplateRef<any>, data: CupStageNew, submitted: (event) => void, message: string): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this), message };
   }
}
