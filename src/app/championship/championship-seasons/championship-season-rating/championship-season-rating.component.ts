import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../../core/auth.service';
import { ChampionshipRating } from '../../../shared/models/championship-rating.model';
import { ChampionshipRatingService } from '../../shared/championship-rating.service';
import { CurrentStateService } from '../../../core/current-state.service';
import { User } from '../../../shared/models/user.model';
import { TitleService } from '../../../core/title.service';

@Component({
    selector: 'app-championship-season-rating',
    templateUrl: './championship-season-rating.component.html',
    styleUrls: ['./championship-season-rating.component.css']
})
export class ChampionshipSeasonRatingComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    championshipRatingItems: ChampionshipRating[];
    errorRating: string;
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
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
