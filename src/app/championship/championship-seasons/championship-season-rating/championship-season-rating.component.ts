import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { User } from '@models/user.model';
import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-championship-season-rating',
    templateUrl: './championship-season-rating.component.html',
    styleUrls: ['./championship-season-rating.component.scss']
})
export class ChampionshipSeasonRatingComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    championshipRatingItems: ChampionshipRating[];
    errorRating: string;

    ngOnInit() {
        this.authenticatedUser = this.currentStateService.getUser();
        this.activatedRoute.params.forEach((params: Params) => {
            this.titleService.setTitle(`Рейтинг гравців в сезоні ${params['id']} - Чемпіонат`);
            const param = [{ parameter: 'season_id', value: <string>params['id'] }];
            this.championshipRatingService.getChampionshipRatingItems(param).subscribe(
                response => {
                    this.championshipRatingItems = response;
                },
                error => {
                    this.errorRating = error;
                }
            );
        });
    }
}
