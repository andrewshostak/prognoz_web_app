import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-championship-home',
    templateUrl: './championship-home.component.html',
    styleUrls: ['./championship-home.component.scss']
})
export class ChampionshipHomeComponent implements OnInit {
    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipService: ChampionshipService,
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    championshipMatches: ChampionshipMatch[];
    championshipPredictions: ChampionshipPrediction[];
    championshipPredictionsForm: FormGroup;
    championshipRatingItems: ChampionshipRating[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    errorChampionshipPredictions: string;
    errorChampionshipRating: string;
    getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
    spinnerButton = false;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    getChampionshipMatchesData() {
        const param = [{ parameter: 'filter', value: 'predictable' }, { parameter: 'coming', value: 'true' }];
        if (this.authenticatedUser) {
            this.championshipMatchService.getChampionshipPredictableMatches(param).subscribe(
                response => {
                    if (response) {
                        this.updateForm(response.championship_matches, true);
                    }
                },
                error => {
                    this.errorChampionshipMatches = error;
                }
            );
        } else {
            this.championshipMatchService.getChampionshipMatches(param).subscribe(
                response => {
                    if (response) {
                        this.updateForm(response.championship_matches, false);
                    }
                },
                error => {
                    this.errorChampionshipMatches = error;
                }
            );
        }
    }

    getChampionshipPredictionsData() {
        const param = [{ parameter: 'distinct', value: 'true' }];
        this.championshipPredictionService.getChampionshipPredictions(param).subscribe(
            response => {
                if (response) {
                    this.championshipPredictions = response.championship_predicts;
                }
            },
            error => {
                this.errorChampionshipPredictions = error;
            }
        );
    }

    getChampionshipRatingData() {
        const param = [{ parameter: 'limit', value: '5' }];
        this.championshipRatingService.getChampionshipRatingItems(param).subscribe(
            response => {
                if (response) {
                    this.championshipRatingItems = response.championship_ratings;
                }
            },
            error => {
                this.errorChampionshipRating = error;
            }
        );
    }

    ngOnInit() {
        this.titleService.setTitle('Найближчі матчі, останні прогнози і топ-рейтингу - Чемпіонат');
        this.authenticatedUser = this.currentStateService.getUser();
        this.championshipPredictionsForm = new FormGroup({});
        this.getChampionshipMatchesData();
        this.getChampionshipRatingData();
        this.getChampionshipPredictionsData();
    }

    onSubmit() {
        this.spinnerButton = true;
        const championshipPredictionsToUpdate = this.championshipService.createChampionshipPredictionsArray(
            this.championshipPredictionsForm
        );
        this.championshipPredictionService.updateChampionshipPredictions(championshipPredictionsToUpdate).subscribe(
            () => {
                this.spinnerButton = false;
                this.notificationsService.success('Успішно', 'Прогнози прийнято');
                this.getChampionshipMatchesData();
                this.getChampionshipPredictionsData();
            },
            error => {
                this.spinnerButton = false;
                this.notificationsService.error('Помилка', error);
            }
        );
    }

    private updateForm(matches: ChampionshipMatch[], isAuthenticatedUser: boolean) {
        this.championshipMatches = matches;
        if (isAuthenticatedUser) {
            this.championshipPredictionsForm = new FormGroup({});
            for (const match of this.championshipMatches) {
                const home = match.championship_predicts.length ? match.championship_predicts[0].home : null;
                const away = match.championship_predicts.length ? match.championship_predicts[0].away : null;
                this.championshipPredictionsForm.addControl(match.id + '_home', new FormControl(home));
                this.championshipPredictionsForm.addControl(match.id + '_away', new FormControl(away));
            }
        } else {
            for (const match of this.championshipMatches) {
                this.championshipPredictionsForm.removeControl(match.id + '_home');
                this.championshipPredictionsForm.removeControl(match.id + '_away');
            }
        }
    }
}
