import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';

import { ConfirmModalService }          from '../../../../core/confirm-modal.service';
import { CupCupMatch }                  from '../../../../shared/models/cup-cup-match.model';
import { CupCupMatchService }           from '../../../../core/services/cup/cup-cup-match.service';
import { NotificationsService }         from 'angular2-notifications';
import { Subscription }                 from 'rxjs/Subscription';

@Component({
  selector: 'app-cup-cup-matches-table',
  templateUrl: './cup-cup-matches-table.component.html',
  styleUrls: ['./cup-cup-matches-table.component.css']
})
export class CupCupMatchesTableComponent implements OnDestroy, OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private confirmModalService: ConfirmModalService,
        private cupCupMatchService: CupCupMatchService,
        private notificationsService: NotificationsService
    ) { }

    activatedRouteSubscription: Subscription;
    cupCupMatches: CupCupMatch[];
    errorCupCupMatches: string;
    currentPage: number;
    lastPage: number;
    path: string;
    perPage: number;
    total: number;

    deleteCupCupMatch(cupCupMatch: CupCupMatch): void {
        this.confirmModalService.show(
            () => {
                this.cupCupMatchService.deleteCupCupMatch(cupCupMatch.id)
                    .subscribe(
                        response => {
                            this.confirmModalService.hide();
                            this.total--;
                            this.cupCupMatches = this.cupCupMatches
                                .filter(match => match.id !== cupCupMatch.id);
                            this.notificationsService
                                .success(
                                    'Успішно',
                                    `Кубок-матч ${cupCupMatch.home_user.name} - ${cupCupMatch.away_user.name} видалено`
                                );
                        },
                        errors => {
                            this.confirmModalService.hide();
                            errors.forEach(error => this.notificationsService.error('Помилка', error));
                        }
                    );
            }
        );
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.path = '/manage/cup/cup-matches/page/';
        this.activatedRouteSubscription = this.activatedRoute.params
            .subscribe((params: Params) => {
                this.cupCupMatchService.getCupCupMatches(
                    null,
                    null,
                    params['number'],
                    null,
                    'id',
                    'desc'
                ).subscribe(
                    response => {
                        this.currentPage = response.current_page;
                        this.lastPage = response.last_page;
                        this.perPage = response.per_page;
                        this.total = response.total;
                        this.cupCupMatches = response.data;
                    },
                    error => {
                        this.errorCupCupMatches = error;
                    }
                );
            });
    }

}
