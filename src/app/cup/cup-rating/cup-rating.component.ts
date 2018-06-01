import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription }                 from 'rxjs/Subscription';

import { AuthService }                  from '../../core/auth.service';
import { CupRating }                    from '../../shared/models/cup-rating.model';
import { CupRatingService }             from './cup-rating.service';
import { CurrentStateService }          from '../../core/current-state.service';
import { Season }                       from '../../shared/models/season.model';
import { SeasonService }                from '../../core/season.service';
import { TitleService }                 from '../../core/title.service';
import { User }                         from '../../shared/models/user.model';

@Component({
  selector: 'app-cup-rating',
  templateUrl: './cup-rating.component.html',
  styleUrls: ['./cup-rating.component.css']
})
export class CupRatingComponent implements OnInit, OnDestroy {

    constructor(
        private authService: AuthService,
        private cupRatingService: CupRatingService,
        private currentStateService: CurrentStateService,
        private seasonService: SeasonService,
        private titleService: TitleService
    ) { }

    authenticatedUser: User;
    cupRating: CupRating[];
    seasons: Season[];
    errorCupRating: string;
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.authenticatedUser = this.currentStateService.user;
        this.titleService.setTitle('Рейтинг гравців - Кубок');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
        this.cupRatingService.getCupRating().subscribe(
            response => {
                this.cupRating = response.map(cupRatingItem => {
                    cupRatingItem.before_previous_season_points =
                        parseFloat(cupRatingItem.before_previous_season_points.toFixed(3));
                    cupRatingItem.previous_season_points =
                        parseFloat(cupRatingItem.previous_season_points.toFixed(3));
                    cupRatingItem.active_season_points =
                        parseFloat(cupRatingItem.active_season_points.toFixed(3));
                    cupRatingItem.points_summary =
                        parseFloat(cupRatingItem.points_summary.toFixed(3));
                    return cupRatingItem;
                });
            },
            error => {
                this.errorCupRating = error;
            }
        );
        this.seasonService.getSeasons().subscribe(
            response => {
                this.seasons = response.seasons
                    .sort((a, b) => b.id - a.id);
            }
        );
    }

}
