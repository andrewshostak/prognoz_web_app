import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { Subscription } from 'rxjs/Subscription';
import { TeamRating } from '@models/team/team-rating.model';
import { TeamRatingUser } from '@models/team/team-rating-user.model';
import { TeamRatingService } from '@services/team/team-rating.service';
import { TeamRatingUserService } from '@services/team/team-rating-user.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { RequestParams } from '@models/request-params.model';

@Component({
    selector: 'app-team-rating',
    templateUrl: './team-rating.component.html',
    styleUrls: ['./team-rating.component.scss']
})
export class TeamRatingComponent implements OnDestroy, OnInit {
    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private currentStateService: CurrentStateService,
        private teamRatingService: TeamRatingService,
        private teamRatingUserService: TeamRatingUserService,
        private titleService: TitleService
    ) {}

    activatedRouteSubscription: Subscription;
    authenticatedUser: User = this.currentStateService.user;
    competitionId: number;
    errorTeamRating: string;
    errorTeamRatingUser: string;
    teamRating: TeamRating[];
    teamRatingUser: TeamRatingUser[];
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Рейтинг команд, бомбардирів і воротарів - Командний');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
        this.activatedRouteSubscription = this.activatedRoute.parent.params.subscribe((params: Params) => {
            this.competitionId = params['competitionId'];
            this.getTeamRatingData();
            this.getTeamRatingUserData();
        });
    }

    private getTeamRatingData() {
        const params: RequestParams[] = [{ parameter: 'competition_id', value: this.competitionId.toString() }];
        this.teamRatingService.getTeamRating(params).subscribe(
            response => {
                this.teamRating = response ? response : [];
            },
            error => {
                this.errorTeamRating = error;
            }
        );
    }

    private getTeamRatingUserData() {
        const params: RequestParams[] = [{ parameter: 'competition_id', value: this.competitionId.toString() }];
        this.teamRatingUserService.getTeamRatingUser(params).subscribe(
            response => {
                this.teamRatingUser = response ? response : [];
            },
            error => {
                this.errorTeamRatingUser = error;
            }
        );
    }
}
