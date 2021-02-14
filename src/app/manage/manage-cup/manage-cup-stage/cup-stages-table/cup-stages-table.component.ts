import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { CupStageNew } from '@models/new/cup-stage-new';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-cup-stages-table',
   templateUrl: './cup-stages-table.component.html',
   styleUrls: ['./cup-stages-table.component.scss']
})
export class CupStagesTableComponent implements OnInit, OnDestroy {
   constructor(
      private activatedRoute: ActivatedRoute,
      private cupStageService: CupStageService,
      private cupStageNewService: CupStageNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   activatedRouteSubscription: Subscription;
   confirmModalMessage: string;
   confirmModalSubmit: (event) => void;
   public cupStages: CupStageNew[];
   currentPage: number;
   errorCupStages: string;
   lastPage: number;
   openedModalReference: NgbModalRef;
   path: string;
   perPage: number;
   total: number;

   deleteCupStage(cupStage: CupStage): void {
      this.cupStageService.deleteCupStage(cupStage.id).subscribe(
         () => {
            this.openedModalReference.close();
            this.total--;
            this.cupStages = this.cupStages.filter(stage => stage.id !== cupStage.id);
            this.notificationsService.success('Успішно', cupStage.title + ' видалено');
         },
         errors => {
            this.openedModalReference.close();
            for (const error of errors) {
               this.notificationsService.error('Помилка', error);
            }
         }
      );
   }

   ngOnDestroy() {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   ngOnInit() {
      this.path = '/manage/cup/stages/page/';
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         const search: CupStageSearch = {
            page: params.number,
            limit: SettingsService.cupStagesPerPage,
            orderBy: 'id',
            sequence: Sequence.Descending,
            relations: ['competition', 'cupStageType']
         };
         this.cupStageNewService.getCupStages(search).subscribe(
            response => {
               this.currentPage = response.current_page;
               this.lastPage = response.last_page;
               this.perPage = response.per_page;
               this.total = response.total;
               this.cupStages = response.data;
            },
            error => {
               this.errorCupStages = error;
            }
         );
      });
   }

   openConfirmModal(content: NgbModalRef, cupStage: CupStage): void {
      this.confirmModalMessage = `Видалити ${cupStage.title}?`;
      this.confirmModalSubmit = () => this.deleteCupStage(cupStage);
      this.openedModalReference = this.ngbModalService.open(content);
   }
}
