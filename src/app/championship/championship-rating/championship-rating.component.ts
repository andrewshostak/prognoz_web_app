import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { HelperService } from '@services/helper.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-rating',
    templateUrl: './championship-rating.component.html',
    styleUrls: ['./championship-rating.component.css']
})
export class ChampionshipRatingComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        public helperService: HelperService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    championshipRatingItems: ChampionshipRating[];
    errorChampionshipRating: string;
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Рейтинг гравців - Чемпіонат');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
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
