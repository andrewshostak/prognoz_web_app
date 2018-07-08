import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { HelperService } from '@services/helper.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-match',
    templateUrl: './championship-match.component.html',
    styleUrls: ['./championship-match.component.css']
})
export class ChampionshipMatchComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private championshipMatchService: ChampionshipMatchService,
        private currentStateService: CurrentStateService,
        public helperService: HelperService,
        private location: Location,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    championshipMatch: ChampionshipMatch;
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatch: string;
    userSubscription: Subscription;

    goBack() {
        this.location.back();
    }

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
            this.getChampionshipMatchData(params['id']);
        });
    }

    private getChampionshipMatchData(id: number) {
        this.championshipMatchService.getChampionshipMatch(id).subscribe(
            response => {
                this.resetChampionshipMatchData();
                this.titleService.setTitle(`${response.championship_match.club_first.title} vs
                        ${response.championship_match.club_second.title}
                        ${response.championship_match.starts_at.slice(0, -3)} - Чемпіонат`);
                this.championshipMatch = response.championship_match;
            },
            error => {
                this.resetChampionshipMatchData();
                this.errorChampionshipMatch = error;
            }
        );
    }

    private resetChampionshipMatchData(): void {
        this.championshipMatch = null;
        this.errorChampionshipMatch = null;
    }
}
