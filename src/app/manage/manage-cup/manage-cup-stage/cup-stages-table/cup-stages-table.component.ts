import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmModalService } from '@services/confirm-modal.service';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-cup-stages-table',
    templateUrl: './cup-stages-table.component.html',
    styleUrls: ['./cup-stages-table.component.scss']
})
export class CupStagesTableComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private confirmModalService: ConfirmModalService,
        private cupStageService: CupStageService,
        private notificationsService: NotificationsService
    ) {}

    activatedRouteSubscription: Subscription;
    cupStages: CupStage[];
    currentPage: number;
    errorCupStages: string;
    lastPage: number;
    path: string;
    perPage: number;
    total: number;

    deleteCupStage(cupStage: CupStage): void {
        this.confirmModalService.show(() => {
            this.cupStageService.deleteCupStage(cupStage.id).subscribe(
                response => {
                    this.confirmModalService.hide();
                    this.total--;
                    this.cupStages = this.cupStages.filter(stage => stage.id !== cupStage.id);
                    this.notificationsService.success('Успішно', cupStage.title + ' видалено');
                },
                errors => {
                    this.confirmModalService.hide();
                    for (const error of errors) {
                        this.notificationsService.error('Помилка', error);
                    }
                }
            );
        }, `Видалити ${cupStage.title}?`);
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.path = '/manage/cup/stages/page/';
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupStageService.getCupStages(params['number']).subscribe(
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
}
