import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-competition-rating',
    templateUrl: './championship-competition-rating.component.html',
    styleUrls: ['./championship-competition-rating.component.css']
})
export class ChampionshipCompetitionRatingComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private championshipRatingService: ChampionshipRatingService,
        private currentStateService: CurrentStateService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    championshipRatingItems: ChampionshipRating[];
    errorChampionshipRating: string | Array<string>;
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
            this.titleService.setTitle(`Рейтинг гравців в конкурсі ${params['competitionId']} - Чемпіонат`);
            const param = [{ parameter: 'competition_id', value: <string>params['competitionId'] }];
            this.championshipRatingService.getChampionshipRatingItems(param).subscribe(
                response => {
                    if (response) {
                        this.resetChampionshipRatingData();
                        this.championshipRatingItems = response.championship_ratings;
                    }
                },
                error => {
                    this.resetChampionshipRatingData();
                    this.errorChampionshipRating = error;
                }
            );
        });
    }

    private resetChampionshipRatingData() {
        this.championshipRatingItems = null;
        this.errorChampionshipRating = null;
    }
}
