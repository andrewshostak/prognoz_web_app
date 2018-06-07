import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/auth.service';
import { ChampionshipMatch } from '../../shared/models/championship-match.model';
import { ChampionshipMatchService } from '../shared/championship-match.service';
import { ChampionshipPrediction } from '../../shared/models/championship-prediction.model';
import { ChampionshipPredictionService } from '../shared/championship-prediction.service';
import { ChampionshipRating } from '../../shared/models/championship-rating.model';
import { ChampionshipRatingService } from '../shared/championship-rating.service';
import { CurrentStateService } from '../../core/current-state.service';
import { environment } from '../../../environments/environment';
import { HelperService } from '../../core/helper.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '../../core/title.service';
import { User } from '../../shared/models/user.model';

@Component({
    selector: 'app-championship-home',
    templateUrl: './championship-home.component.html',
    styleUrls: ['./championship-home.component.css']
})
export class ChampionshipHomeComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private championshipMatchService: ChampionshipMatchService,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        public helperService: HelperService,
        private notificationService: NotificationsService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    championshipMatches: ChampionshipMatch[];
    championshipPredictions: ChampionshipPrediction[];
    championshipPredictionsForm: FormGroup;
    championshipRatingItems: ChampionshipRating[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    errorChampionshipPredictions: string;
    errorChampionshipRating: string;
    spinnerButton = false;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

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

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Найближчі матчі, останні прогнози і топ-рейтингу - Чемпіонат');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            this.getChampionshipMatchesData();
        });
        this.championshipPredictionsForm = new FormGroup({});
        this.getChampionshipMatchesData();
        this.getChampionshipRatingData();
        this.getChampionshipPredictionsData();
    }

    onSubmit() {
        this.spinnerButton = true;
        const championshipPredictionsToUpdate = this.helperService.createChampionshipPredictionsArray(this.championshipPredictionsForm);
        this.championshipPredictionService.updateChampionshipPredictions(championshipPredictionsToUpdate).subscribe(
            response => {
                this.spinnerButton = false;
                this.notificationService.success('Успішно', 'Прогнози прийнято');
                this.getChampionshipMatchesData();
                this.getChampionshipPredictionsData();
            },
            error => {
                this.spinnerButton = false;
                this.notificationService.error('Помилка', error);
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
