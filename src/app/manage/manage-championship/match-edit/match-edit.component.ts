import { Component, OnDestroy, OnInit } from '@angular/core';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-match-edit',
    templateUrl: './match-edit.component.html',
    styleUrls: ['./match-edit.component.scss']
})
export class MatchEditComponent implements OnInit, OnDestroy {
    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private championshipRatingService: ChampionshipRatingService,
        private notificationService: NotificationsService
    ) {}

    championshipMatches: ChampionshipMatch[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    isUpdatedMatches = false;
    spinnerButton: any = {};
    spinnerUpdateRatingButton = false;
    updatedMatches: any = {};

    ngOnDestroy() {
        if (Object.keys(this.updatedMatches).length !== 0 && this.isUpdatedMatches) {
            this.updateRating();
        }
    }

    ngOnInit() {
        const param = [{ parameter: 'filter', value: 'active' }];
        this.championshipMatchService.getChampionshipMatches(param).subscribe(
            response => {
                if (response) {
                    this.championshipMatches = response.championship_matches;
                }
            },
            error => {
                this.errorChampionshipMatches = error;
            }
        );
    }

    onSubmit(match: ChampionshipMatch) {
        if (!this.validateResult(match.home) || !this.validateResult(match.away)) {
            this.notificationService.error('Помилка', 'Результат в матчі ' + match.id + ' введено неправильно');
            return;
        }
        this.spinnerButton['match_' + match.id] = true;
        const championshipMatch = new ChampionshipMatch();
        championshipMatch.id = match.id;
        championshipMatch.home = match.home;
        championshipMatch.away = match.away;
        this.championshipMatchService.updateChampionshipMatch(championshipMatch).subscribe(
            response => {
                this.spinnerButton['match_' + match.id] = false;
                this.updatedMatches['match_' + match.id] = response;
                this.isUpdatedMatches = true;
                this.notificationService.success('Успішно', 'Результат в матчі ' + response.id + ' добавлено!');
            },
            errors => {
                this.spinnerButton['match_' + match.id] = false;
                for (const error of errors) {
                    this.notificationService.error('Помилка', error);
                }
            }
        );
    }

    updateRating() {
        this.spinnerUpdateRatingButton = true;
        this.championshipRatingService.updateChampionshipRatingItems().subscribe(
            response => {
                this.isUpdatedMatches = false;
                this.notificationService.success('Успішно', 'Рейтинг оновлено');
                this.spinnerUpdateRatingButton = false;
            },
            error => {
                this.notificationService.error('Помилка', 'Оновити рейтинг не вдалось');
                this.spinnerUpdateRatingButton = false;
            }
        );
    }

    private validateResult(score) {
        const regExp = /^[0-9]$/;
        return regExp.test(score);
    }
}
