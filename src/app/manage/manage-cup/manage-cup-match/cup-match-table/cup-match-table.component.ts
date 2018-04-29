import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';

import { ConfirmModalService }          from '../../../../core/confirm-modal.service';
import { CupMatch }                     from '../../../../shared/models/cup-match.model';
import { CupMatchService }              from '../../../../core/services/cup/cup-match.service';
import { NotificationsService }         from 'angular2-notifications';
import { Subscription }                 from 'rxjs/Subscription';

@Component({
  selector: 'app-cup-match-table',
  templateUrl: './cup-match-table.component.html',
  styleUrls: ['./cup-match-table.component.css']
})
export class CupMatchTableComponent implements OnInit, OnDestroy {

    constructor(
        private activatedRoute: ActivatedRoute,
        private confirmModalService: ConfirmModalService,
        private cupMatchService: CupMatchService,
        private notificationsService: NotificationsService
    ) { }

    activatedRouteSubscription: Subscription;
    cupMatches: CupMatch[];
    currentPage: number;
    errorCupMatches: string;
    lastPage: number;
    path: string;
    perPage: number;
    total: number;

    deleteCupMatch(cupMatch: CupMatch): void {
        this.confirmModalService.show(
            () => {
                this.cupMatchService.deleteCupMatch(cupMatch.id)
                    .subscribe(
                        response => {
                            this.confirmModalService.hide();
                            this.total--;
                            this.cupMatches = this.cupMatches
                                .filter(match => match.id !== cupMatch.id);
                            this.notificationsService
                                .success(
                                    'Успішно',
                                    `Матч ${cupMatch.club_first.title} - ${cupMatch.club_second.title} видалено`
                                );
                        },
                        errors => {
                            this.confirmModalService.hide();
                            for (const error of errors) {
                                this.notificationsService.error('Помилка', error);
                            }
                        }
                    );
            },
            `Видалити ${cupMatch.club_first.title} - ${cupMatch.club_second.title}?`
        );
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.path = '/manage/cup/matches/page/';
        this.activatedRouteSubscription = this.activatedRoute.params
            .subscribe((params: Params) => {
                this.cupMatchService.getCupMatches(params['number']).subscribe(
                    response => {
                        this.currentPage = response.current_page;
                        this.lastPage = response.last_page;
                        this.perPage = response.per_page;
                        this.total = response.total;
                        this.cupMatches = response.data;
                    },
                    error => {
                        this.errorCupMatches = error;
                    }
                );
            });
    }

}
