import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { environment } from '@env';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-cup-matches-table',
    templateUrl: './cup-cup-matches-table.component.html',
    styleUrls: ['./cup-cup-matches-table.component.scss']
})
export class CupCupMatchesTableComponent implements OnDestroy, OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private cupCupMatchService: CupCupMatchService,
        private ngbModalService: NgbModal,
        private notificationsService: NotificationsService
    ) {}

    activatedRouteSubscription: Subscription;
    confirmModalMessage: string;
    confirmModalSubmit: (event) => void;
    cupCupMatches: CupCupMatch[];
    errorCupCupMatches: string;
    currentPage: number;
    lastPage: number;
    openedModalReference: NgbModalRef;
    path: string;
    perPage: number;
    total: number;
    userImageDefault: string;
    userImagesUrl: string;
    isScore = UtilsService.isScore;

    deleteCupCupMatch(cupCupMatch: CupCupMatch): void {
        this.cupCupMatchService.deleteCupCupMatch(cupCupMatch.id).subscribe(
            () => {
                this.openedModalReference.close();
                this.total--;
                this.cupCupMatches = this.cupCupMatches.filter(match => match.id !== cupCupMatch.id);
                this.notificationsService.success(
                    'Успішно',
                    `Кубок-матч ${cupCupMatch.home_user.name} - ${cupCupMatch.away_user.name} видалено`
                );
            },
            errors => {
                this.openedModalReference.close();
                errors.forEach(error => this.notificationsService.error('Помилка', error));
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

    openConfirmModal(content: NgbModalRef, cupCupMatch: CupCupMatch): void {
        this.confirmModalMessage = `Видалити ${cupCupMatch.home_user.name} - ${cupCupMatch.away_user.name}?`;
        this.confirmModalSubmit = () => this.deleteCupCupMatch(cupCupMatch);
        this.openedModalReference = this.ngbModalService.open(content);
    }
}
