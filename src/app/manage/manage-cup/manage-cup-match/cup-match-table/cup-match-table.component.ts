import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmModalService } from '@services/confirm-modal.service';
import { CupMatch } from '@models/cup/cup-match.model';
import { CupMatchService } from '@services/cup/cup-match.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-cup-match-table',
    templateUrl: './cup-match-table.component.html',
    styleUrls: ['./cup-match-table.component.scss']
})
export class CupMatchTableComponent implements OnDestroy, OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private confirmModalService: ConfirmModalService,
        private cupMatchService: CupMatchService,
        private notificationsService: NotificationsService
    ) {}

    activatedRouteSubscription: Subscription;
    cupMatches: CupMatch[];
    currentPage: number;
    clubImagesUrl: string;
    errorCupMatches: string;
    lastPage: number;
    path: string;
    perPage: number;
    total: number;

    addResult(cupMatch: CupMatch): void {
        this.cupMatchService.updateCupMatch(cupMatch, cupMatch.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Результат в матчі ' + response.id + ' добавлено!');
                const index = this.cupMatches.findIndex(item => item.id === cupMatch.id);
                if (index > -1) {
                    this.cupMatches[index] = response;
                }
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    cupMatchHasEndedStages(cupMatch: CupMatch): boolean {
        return cupMatch.cup_stages.some(cupStage => cupStage.ended);
    }

    deleteCupMatch(cupMatch: CupMatch): void {
        this.confirmModalService.show(() => {
            this.cupMatchService.deleteCupMatch(cupMatch.id).subscribe(
                () => {
                    this.confirmModalService.hide();
                    this.total--;
                    this.cupMatches = this.cupMatches.filter(match => match.id !== cupMatch.id);
                    this.notificationsService.success(
                        'Успішно',
                        `Матч ${cupMatch.club_first.title} - ${cupMatch.club_second.title} видалено`
                    );
                },
                errors => {
                    this.confirmModalService.hide();
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                }
            );
        }, `Видалити ${cupMatch.club_first.title} - ${cupMatch.club_second.title}?`);
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.clubImagesUrl = environment.apiImageClubs;
        this.path = '/manage/cup/matches/page/';
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupMatchService.getCupMatches(params.number, null, null, 'starts_at', 'desc').subscribe(
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
