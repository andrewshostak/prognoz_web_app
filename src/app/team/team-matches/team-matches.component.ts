import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CompetitionService } from '@services/competition.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

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
    nextRound: string;
    previousRound: string;
    path: string;
    routerEventsSubscription: Subscription;
    round: number;
    teamTeamMatches: TeamTeamMatch[];
    userSubscription: Subscription;

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
                    this.nextRound = null;
                    this.previousRound = null;
                    return;
                }

                this.teamTeamMatches = response.data;
                this.nextRound = response.next_page_url;
                this.previousRound = response.prev_page_url;
            },
            error => {
                this.teamTeamMatches = null;
                this.nextRound = null;
                this.previousRound = null;
                this.errorTeamTeamMatches = error;
            }
        );
    }

    private getCompetitionData() {
        this.competitionService.getCompetition(this.competitionId).subscribe(
            response => {
                this.errorCompetition = null;
                if (response.stated) {
                    this.router.navigate(['/team', 'competitions', response.id, 'squads']);
                    return;
                }

                this.getTeamTeamMatchesData(this.competitionId, response.active_round);
            },
            error => {
                this.errorCompetition = error;
            }
        );
    }

    private setPageTitle(): void {
        this.titleService.setTitle(`Матчі ${this.round ? this.round + ' туру' : 'поточного туру'} - Командний`);
    }

    private setPath(competitionId: number): void {
        this.path = `/team/competitions/${competitionId}/matches/round/`;
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

                this.setPath(this.competitionId);

                if (!this.round) {
                    this.getCompetitionData();
                    return;
                }

                this.getTeamTeamMatchesData(this.competitionId, this.round);
            }
        });
    }
}
