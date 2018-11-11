import { Component, OnInit } from '@angular/core';

import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-rating',
    templateUrl: './championship-rating.component.html',
    styleUrls: ['./championship-rating.component.scss']
})
export class ChampionshipRatingComponent implements OnInit {
    constructor(
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    championshipRatingItems: ChampionshipRating[];
    errorChampionshipRating: string;

    ngOnInit() {
        this.titleService.setTitle('Рейтинг гравців - Чемпіонат');
        this.authenticatedUser = this.currentStateService.getUser();
        this.championshipRatingService.getChampionshipRatingItems().subscribe(
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
}
