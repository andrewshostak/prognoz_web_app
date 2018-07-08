import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { HelperService } from '@services/helper.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';

declare const $: any;

@Component({
    selector: 'app-championship-user',
    templateUrl: './championship-user.component.html',
    styleUrls: ['./championship-user.component.css']
})
export class ChampionshipUserComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipRatingService: ChampionshipRatingService,
        public helperService: HelperService,
        private titleService: TitleService,
        private userService: UserService
    ) {}

    championshipPredictions: ChampionshipPrediction[];
    championshipRatingItem: ChampionshipRating;
    errorChampionshipPredictions: string;
    errorRating: string;
    errorUser: string;
    user: User;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getUserData(params['id']);
            this.getChampionshipRatingItemData(params['id']);
            this.getChampionshipPredictionsData(params['id']);
        });
    }

    ngOnDestroy() {
        $('[data-toggle="tooltip"]').tooltip('dispose');
    }

    private getChampionshipPredictionsData(userId: number) {
        const param = [{ parameter: 'user_id', value: userId.toString() }];
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

    private getChampionshipRatingItemData(id: number) {
        this.championshipRatingService.getChampionshipRatingItem(id).subscribe(
            response => {
                this.championshipRatingItem = response;
            },
            error => {
                this.errorRating = error;
            }
        );
    }

    private getUserData(id: number) {
        this.userService.getUser(id).subscribe(
            response => {
                this.user = response;
                this.titleService.setTitle(`Прогнози ${this.user.name}
                    ${this.helperService.getHometown(this.user.hometown)} - Чемпіонат`);
                $(() => $('[data-toggle="tooltip"]').tooltip());
            },
            error => {
                this.errorUser = error;
            }
        );
    }
}
