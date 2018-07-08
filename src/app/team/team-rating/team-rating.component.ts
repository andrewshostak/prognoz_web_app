import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { TeamRating } from '@models/team/team-rating.model';
import { TeamRatingUser } from '@models/team/team-rating-user.model';
import { TeamRatingService } from '@services/team/team-rating.service';
import { TeamRatingUserService } from '@services/team/team-rating-user.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-team-rating',
    templateUrl: './team-rating.component.html',
    styleUrls: ['./team-rating.component.css']
})
export class TeamRatingComponent implements OnDestroy, OnInit {
    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private teamRatingService: TeamRatingService,
        private teamRatingUserService: TeamRatingUserService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    errorTeamRating: string;
    errorTeamRatingUser: string;
    teamRating: TeamRating[];
    teamRatingUser: TeamRatingUser[];
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Рейтинг команд, бомбардирів і воротарів - Командний');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
        this.getTeamRatingData();
        this.getTeamRatingUserData();
    }

    private getTeamRatingData() {
        this.teamRatingService.getTeamRating().subscribe(
            response => {
                if (response) {
                    this.teamRating = response;
                }
            },
            error => {
                this.errorTeamRating = error;
            }
        );
    }

    private getTeamRatingUserData() {
        this.teamRatingUserService.getTeamRatingUser().subscribe(
            response => {
                if (response) {
                    this.teamRatingUser = response;
                }
            },
            error => {
                this.errorTeamRatingUser = error;
            }
        );
    }
}
