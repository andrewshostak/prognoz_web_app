import { Component, OnInit } from '@angular/core';

import { CupRating } from '@models/cup/cup-rating.model';
import { CupRatingService } from '@services/cup/cup-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { Season } from '@models/season.model';
import { SeasonService } from '@services/season.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-cup-rating',
    templateUrl: './cup-rating.component.html',
    styleUrls: ['./cup-rating.component.scss']
})
export class CupRatingComponent implements OnInit {
    constructor(
        private cupRatingService: CupRatingService,
        private currentStateService: CurrentStateService,
        private seasonService: SeasonService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    cupRating: CupRating[];
    seasons: Season[];
    errorCupRating: string;

    ngOnInit() {
        this.authenticatedUser = this.currentStateService.getUser();
        this.titleService.setTitle('Рейтинг гравців - Кубок');
        this.authenticatedUser = this.currentStateService.getUser();
        this.cupRatingService.getCupRating().subscribe(
            response => {
                this.cupRating = response.map(cupRatingItem => {
                    cupRatingItem.before_previous_season_points = parseFloat(cupRatingItem.before_previous_season_points.toFixed(3));
                    cupRatingItem.previous_season_points = parseFloat(cupRatingItem.previous_season_points.toFixed(3));
                    cupRatingItem.active_season_points = parseFloat(cupRatingItem.active_season_points.toFixed(3));
                    cupRatingItem.points_summary = parseFloat(cupRatingItem.points_summary.toFixed(3));
                    return cupRatingItem;
                });
            },
            error => {
                this.errorCupRating = error;
            }
        );
        this.seasonService.getSeasons().subscribe(response => {
            this.seasons = response.seasons.sort((a, b) => b.id - a.id);
        });
    }
}
