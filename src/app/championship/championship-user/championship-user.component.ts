import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-championship-user',
    templateUrl: './championship-user.component.html',
    styleUrls: ['./championship-user.component.scss']
})
export class ChampionshipUserComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipRatingService: ChampionshipRatingService,
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
                    ${UtilsService.getHomeCityInBrackets(this.user.hometown)} - Чемпіонат`);
            },
            error => {
                this.errorUser = error;
            }
        );
    }
}
