import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmModalService } from '@services/confirm-modal.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { RequestParams } from '@models/request-params.model';
import { Subscription } from 'rxjs/Subscription';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';

@Component({
    selector: 'app-team-matches-table',
    templateUrl: './team-matches-table.component.html',
    styleUrls: ['./team-matches-table.component.scss']
})
export class TeamMatchesTableComponent implements OnDestroy, OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private confirmModalService: ConfirmModalService,
        private teamMatchService: TeamMatchService,
        private notificationsService: NotificationsService
    ) {}

    activatedRouteSubscription: Subscription;
    currentPage: number;
    clubImagesUrl: string;
    errorTeamMatches: string;
    lastPage: number;
    path: string;
    perPage: number;
    teamMatches: TeamMatch[];
    total: number;

    addResult(teamMatch: TeamMatch): void {
        this.teamMatchService.updateTeamMatch(teamMatch).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Результат в матчі ' + response.id + ' добавлено!');
                const index = this.teamMatches.findIndex(item => item.id === teamMatch.id);
                if (index > -1) {
                    this.teamMatches[index] = response;
                }
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    deleteTeamMatch(teamMatch: TeamMatch): void {
        this.confirmModalService.show(() => {
            this.teamMatchService.deleteTeamMatch(teamMatch.id).subscribe(
                () => {
                    this.confirmModalService.hide();
                    this.total--;
                    this.teamMatches = this.teamMatches.filter(match => match.id !== teamMatch.id);
                    this.notificationsService.success(
                        'Успішно',
                        `Матч ${teamMatch.club_first.title} - ${teamMatch.club_second.title} видалено`
                    );
                },
                errors => {
                    this.confirmModalService.hide();
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                }
            );
        }, `Видалити ${teamMatch.club_first.title} - ${teamMatch.club_second.title}?`);
    }

    teamMatchHasEndedCompetitions(teamMatch: TeamMatch): boolean {
        return teamMatch.competitions.some(competition => competition.ended);
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.clubImagesUrl = environment.apiImageClubs;
        this.path = '/manage/team/matches/page/';
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            const requestParams: RequestParams[] = [{ parameter: 'page', value: params.number }];
            this.teamMatchService.getTeamMatches(requestParams).subscribe(
                response => {
                    this.currentPage = response.current_page;
                    this.lastPage = response.lastPage;
                    this.perPage = response.per_page;
                    this.total = response.total;
                    this.teamMatches = response.data;
                },
                error => {
                    this.errorTeamMatches = error;
                }
            );
        });
    }
}