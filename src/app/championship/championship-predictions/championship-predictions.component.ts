import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-predictions',
    templateUrl: './championship-predictions.component.html',
    styleUrls: ['./championship-predictions.component.scss']
})
export class ChampionshipPredictionsComponent implements OnInit {
    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipService: ChampionshipService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    championshipMatches: ChampionshipMatch[];
    championshipPredictionsForm: FormGroup;
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    spinnerButton = false;

    ngOnInit() {
        this.titleService.setTitle('Зробити прогнози - Чемпіонат');
        this.authenticatedUser = this.currentStateService.getUser();
        this.championshipPredictionsForm = new FormGroup({});
        this.getChampionshipMatchesData();
    }

    onSubmit() {
        this.spinnerButton = true;
        const championshipPredictionsToUpdate = this.championshipService.createChampionshipPredictionsArray(
            this.championshipPredictionsForm
        );
        this.championshipPredictionService.updateChampionshipPredictions(championshipPredictionsToUpdate).subscribe(
            response => {
                this.spinnerButton = false;
                this.notificationsService.success('Успішно', 'Прогнози прийнято');
                this.getChampionshipMatchesData();
            },
            error => {
                this.spinnerButton = false;
                this.notificationsService.error('Помилка', error);
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
