import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription }                 from 'rxjs/Subscription';

import { AuthService }                  from '../../core/auth.service';
import { CupRating }                    from '../../shared/models/cup-rating.model';
import { CupRatingService }             from './cup-rating.service';
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
        this.titleService.setTitle('Рейтинг гравців - Кубок');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
        this.cupRatingService.getCupRating().subscribe(
            response => {
                this.cupRating = response;
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
