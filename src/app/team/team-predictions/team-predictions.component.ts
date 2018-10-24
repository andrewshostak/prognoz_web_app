import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { RequestParams } from '@models/request-params.model';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TeamPrediction } from '@models/team/team-prediction.model';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-predictions',
    templateUrl: './team-predictions.component.html',
    styleUrls: ['./team-predictions.component.scss']
})
export class TeamPredictionsComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private router: Router,
        private teamMatchService: TeamMatchService,
        private teamTeamMatchService: TeamTeamMatchService,
        private teamPredictionService: TeamPredictionService,
        private titleService: TitleService
    ) {
        this.subscribeToRouterEvents();
    }

    authenticatedUser: User = this.currentStateService.user;
    blockedTeamMatchFirst: TeamMatch = null;
    blockedTeamMatchSecond: TeamMatch = null;
    competitionId: number;
    errorTeamMatches: string;
    errorTeamTeamMatches: string;
    errorTeamPredictions: string;
    isGoalkeeper: boolean;
    noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
    oppositeTeamId: number;
    round: number;
    roundsArray: { id: number; title: string }[];
    routerEventsSubscription: Subscription;
    teamMatches: TeamMatch[];
    teamTeamMatches: TeamTeamMatch[];
    teamPredictions: TeamPrediction[];
    userSubscription: Subscription;

    getMyTeamMatchesData(competitionId: number, round?: number) {
        const param = [{ parameter: 'filter', value: 'opponents' }, { parameter: 'competition_id', value: this.competitionId.toString() }];
        if (round) {
            param.push({ parameter: 'round', value: round.toString() });
        }
        this.teamMatchService.getTeamMatchesAuthUser(param).subscribe(
            response => {
                this.errorTeamMatches = null;
                if (!response) {
                    this.teamMatches = null;
                    return;
                }

                this.teamMatches = response.team_matches;
                this.setBlockedMatches(response.team_matches);
            },
            error => {
                this.teamMatches = null;
                this.resetTeamGoalkeeperData();
                this.errorTeamMatches = error;
            }
        );
    }

    getTeamGoalkeeperData() {
        if (this.teamTeamMatches && this.authenticatedUser) {
            this.getMyTeamMatchesData(this.competitionId, this.round);
            for (const teamTeamMatch of this.teamTeamMatches) {
                if (this.authenticatedUser.id === teamTeamMatch.home_team_goalkeeper_id) {
                    this.oppositeTeamId = teamTeamMatch.away_team_id;
                    this.isGoalkeeper = true;
                } else if (this.authenticatedUser.id === teamTeamMatch.away_team_goalkeeper_id) {
                    this.oppositeTeamId = teamTeamMatch.home_team_id;
                    this.isGoalkeeper = true;
                }
            }
        }
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
        this.titleService.setTitle('Зробити прогнози - Командний');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            this.resetTeamGoalkeeperData();
            if (response) {
                this.getTeamTeamMatchesData(this.competitionId, this.round);
                this.getTeamPredictionsData(this.competitionId, this.round);
            }
        });
    }

    reloadTeamGoalkeeperData(): void {
        this.resetTeamGoalkeeperData();
        this.getTeamTeamMatchesData(this.competitionId, this.round);
    }

    reloadTeamPredictionsData() {
        this.getTeamPredictionsData(this.competitionId, this.round);
    }

    setBlockedMatches(teamMatches: TeamMatch[]) {
        for (const teamMatch of teamMatches) {
            if (teamMatch.team_predictions && teamMatch.team_predictions[0] && teamMatch.team_predictions[0].blocked_by) {
                if (!this.blockedTeamMatchFirst) {
                    this.blockedTeamMatchFirst = teamMatch;
                } else {
                    this.blockedTeamMatchSecond = teamMatch;
                }
            }
        }
    }

    private getTeamTeamMatchesData(competitionId: number, round?: number) {
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
                this.getTeamGoalkeeperData();
            },
            error => {
                this.teamTeamMatches = null;
                this.errorTeamTeamMatches = error;
            }
        );
    }

    private getTeamPredictionsData(competitionId: number, round?: number) {
        const params: RequestParams[] = [{ parameter: 'competition_id', value: competitionId.toString() }];
        if (round) {
            params.push({ parameter: 'round', value: round.toString() });
        }
        this.teamPredictionService.getTeamPredictions(params).subscribe(
            response => {
                this.errorTeamPredictions = null;
                if (!response || !response.team_predictions) {
                    this.teamPredictions = null;
                    return;
                }

                this.teamPredictions = response.team_predictions;
            },
            error => {
                this.teamPredictions = null;
                this.errorTeamPredictions = error;
            }
        );
    }

    private resetTeamGoalkeeperData(): void {
        this.blockedTeamMatchFirst = null;
        this.blockedTeamMatchSecond = null;
        this.isGoalkeeper = false;
        this.oppositeTeamId = null;
    }

    private subscribeToRouterEvents(): void {
        this.routerEventsSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.urlChanged(event.url);
            }
        });
    }

    private urlChanged(url: string): void {
        const urlAsArray = url.split('/');

        const temporaryCompetitionsIndex = urlAsArray.findIndex(item => item === 'competitions');
        if (temporaryCompetitionsIndex > -1) {
            this.competitionId = parseInt(urlAsArray[temporaryCompetitionsIndex + 1], 10);
        }

        const temporaryRoundIndex = urlAsArray.findIndex(item => item === 'round');
        if (temporaryRoundIndex > -1) {
            this.round = parseInt(urlAsArray[temporaryRoundIndex + 1], 10);
        }

        if (!this.competitionId) {
            return;
        }

        if (!this.authenticatedUser) {
            return;
        }

        this.resetTeamGoalkeeperData();
        this.getTeamTeamMatchesData(this.competitionId, this.round);
        this.getTeamPredictionsData(this.competitionId, this.round);
    }
}
