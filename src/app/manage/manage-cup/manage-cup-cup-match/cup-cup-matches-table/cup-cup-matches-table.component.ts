import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmModalService } from '@services/confirm-modal.service';
import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { environment } from '@env';
import { HelperService } from '@services/helper.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';

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
        private helperService: HelperService,
        private notificationsService: NotificationsService
    ) {}

    activatedRouteSubscription: Subscription;
    cupCupMatches: CupCupMatch[];
    errorCupCupMatches: string;
    currentPage: number;
    lastPage: number;
    path: string;
    perPage: number;
    total: number;
    userImageDefault: string;
    userImagesUrl: string;

    deleteCupCupMatch(cupCupMatch: CupCupMatch): void {
        this.confirmModalService.show(() => {
            this.cupCupMatchService.deleteCupCupMatch(cupCupMatch.id).subscribe(
                response => {
                    this.confirmModalService.hide();
                    this.total--;
                    this.cupCupMatches = this.cupCupMatches.filter(match => match.id !== cupCupMatch.id);
                    this.notificationsService.success(
                        'Успішно',
                        `Кубок-матч ${cupCupMatch.home_user.name} - ${cupCupMatch.away_user.name} видалено`
                    );
                },
                errors => {
                    this.confirmModalService.hide();
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                }
            );
        });
    }

    isScore(cupCupMatch: CupCupMatch): boolean {
        return this.helperService.isScore(cupCupMatch.home, cupCupMatch.away);
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.path = '/manage/cup/cup-matches/page/';
        this.userImagesUrl = environment.apiImageUsers;
        this.userImageDefault = environment.imageUserDefault;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupCupMatchService.getCupCupMatches(null, null, params['number'], null, 'id', 'desc').subscribe(
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
