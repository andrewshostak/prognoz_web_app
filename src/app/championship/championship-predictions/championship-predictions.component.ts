import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { HelperService } from '@services/helper.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-predictions',
    templateUrl: './championship-predictions.component.html',
    styleUrls: ['./championship-predictions.component.scss']
})
export class ChampionshipPredictionsComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private championshipMatchService: ChampionshipMatchService,
        private championshipPredictionService: ChampionshipPredictionService,
        private currentStateService: CurrentStateService,
        private helperService: HelperService,
        private notificationService: NotificationsService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    championshipMatches: ChampionshipMatch[];
    championshipPredictionsForm: FormGroup;
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    spinnerButton = false;
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Зробити прогнози - Чемпіонат');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            this.getChampionshipMatchesData();
        });
        this.championshipPredictionsForm = new FormGroup({});
        this.getChampionshipMatchesData();
    }

    onSubmit() {
        this.spinnerButton = true;
        const championshipPredictionsToUpdate = this.helperService.createChampionshipPredictionsArray(this.championshipPredictionsForm);
        this.championshipPredictionService.updateChampionshipPredictions(championshipPredictionsToUpdate).subscribe(
            response => {
                this.spinnerButton = false;
                this.notificationService.success('Успішно', 'Прогнози прийнято');
                this.getChampionshipMatchesData();
            },
            error => {
                this.spinnerButton = false;
                this.notificationService.error('Помилка', error);
            }
        );
    }

    private getChampionshipMatchesData() {
        const param = [{ parameter: 'filter', value: 'predictable' }];
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
