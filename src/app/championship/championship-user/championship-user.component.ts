import { Component, OnInit }                    from '@angular/core';
import { ActivatedRoute, Params }               from '@angular/router';

import { ChampionshipPrediction }               from '../../shared/models/championship-prediction.model';
import { ChampionshipPredictionService }        from '../shared/championship-prediction.service';
import { ChampionshipRating }                   from '../../shared/models/championship-rating.model';
import { ChampionshipRatingService }            from '../shared/championship-rating.service';
import { environment }                          from '../../../environments/environment';
import { HelperService }                        from '../../core/helper.service';
import { TitleService }                         from '../../core/title.service';
import { User }                                 from '../../shared/models/user.model';
import { UserService }                          from '../../core/user.service';

declare const $: any;

@Component({
  selector: 'app-championship-user',
  templateUrl: './championship-user.component.html',
  styleUrls: ['./championship-user.component.css']
})
export class ChampionshipUserComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipRatingService: ChampionshipRatingService,
        public helperService: HelperService,
        private titleService: TitleService,
        private userService: UserService
    ) { }

    awardsImagesUrl: string = environment.apiImageAwards;
    championshipPredictions: ChampionshipPrediction[];
    championshipRatingItem: ChampionshipRating;
    clubImagesUrl: string = environment.apiImageClubs;
    errorChampionshipPredictions: string;
    errorRating: string;
    errorUser: string;
    user: User;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getUserData(params['id']);
            this.getChampionshipRatingItemData(params['id']);
            this.getChampionshipPredictionsData(params['id']);
        });
    }

    private getChampionshipPredictionsData(userId: number) {
        let param = [{parameter: 'user_id', value: userId.toString()}];
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
