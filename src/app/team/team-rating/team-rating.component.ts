import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/auth.service';
import { CurrentStateService } from '../../core/current-state.service';
import { TeamRating } from '../../shared/models/team-rating.model';
import { TeamRatingUser } from '../../shared/models/team-rating-user.model';
import { TeamRatingService } from '../shared/team-rating.service';
import { TeamRatingUserService } from '../shared/team-rating-user.service';
import { TitleService } from '../../core/title.service';
import { User } from '../../shared/models/user.model';

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
