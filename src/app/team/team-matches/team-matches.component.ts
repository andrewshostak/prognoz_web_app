import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CompetitionService } from '@services/competition.service';
import { CurrentStateService } from '@services/current-state.service';
import { RequestParams } from '@models/request-params.model';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-matches',
    templateUrl: './team-matches.component.html',
    styleUrls: ['./team-matches.component.scss']
})
export class TeamMatchesComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private competitionService: CompetitionService,
        private currentStateService: CurrentStateService,
        private router: Router,
        private teamTeamMatchService: TeamTeamMatchService,
        private titleService: TitleService
    ) {
        this.subscribeToRouterEvents();
    }

    authenticatedUser: User = this.currentStateService.user;
    competitionId: number;
    errorCompetition: string;
    errorTeamTeamMatches: string;
    routerEventsSubscription: Subscription;
    round: number;
    roundsArray: { id: number; title: string }[];
    teamTeamMatches: TeamTeamMatch[];
    userSubscription: Subscription;

    getTeamTeamMatchesData(competitionId: number, round?: number) {
        const params: RequestParams[] = [{ parameter: 'competition_id', value: competitionId.toString() }];
        if (round) {
            params.push({ parameter: 'page', value: round.toString() });
        }
        this.teamTeamMatchService.getTeamTeamMatches(params).subscribe(
            response => {
                this.errorTeamTeamMatches = null;
                if (!response) {
                    this.teamTeamMatches = null;
                    return;
                }

                if (!this.round) {
                    this.round = response.current_page;
                }

                this.teamTeamMatches = response.data;
                this.roundsArray = UtilsService.createRoundsArrayFromTeamsQuantity(response.per_page * 2);
            },
            error => {
                this.teamTeamMatches = null;
                this.errorTeamTeamMatches = error;
            }
        );
    }

    ngOnDestroy() {
        if (!this.routerEventsSubscription.closed) {
            this.routerEventsSubscription.unsubscribe();
        }
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
    }

    private setPageTitle(): void {
        this.titleService.setTitle(`Матчі ${this.round ? this.round + ' туру' : 'поточного туру'} - Командний`);
    }

    private subscribeToRouterEvents(): void {
        this.routerEventsSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const urlAsArray = event.url.split('/');

                const temporaryCompetitionsIndex = urlAsArray.findIndex(item => item === 'competitions');
                if (temporaryCompetitionsIndex > -1) {
                    this.competitionId = parseInt(urlAsArray[temporaryCompetitionsIndex + 1], 10);
                }

                const temporaryRoundIndex = urlAsArray.findIndex(item => item === 'round');
                if (temporaryRoundIndex > -1) {
                    this.round = parseInt(urlAsArray[temporaryRoundIndex + 1], 10);
                }

                this.setPageTitle();

                if (!this.competitionId) {
                    return;
                }

                this.getTeamTeamMatchesData(this.competitionId, this.round);
            }
        });
    }
}
