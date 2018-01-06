import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { Subscription }                 from 'rxjs/Subscription';

import { AuthService }                  from '../../core/auth.service';
import { CurrentStateService }          from '../../core/current-state.service';
import { TeamMatch }                    from '../../shared/models/team-match.model';
import { TeamMatchService }             from '../shared/team-match.service';
import { TeamTeamMatch }                from '../../shared/models/team-team-match.model';
import { TeamTeamMatchService }         from '../shared/team-team-match.service';
import { TeamPrediction }               from '../../shared/models/team-prediction.model';
import { TeamPredictionService }        from '../shared/team-prediction.service';
import { TitleService }                 from '../../core/title.service';
import { User }                         from '../../shared/models/user.model';

@Component({
    selector: 'app-team-predictions',
    templateUrl: './team-predictions.component.html',
    styleUrls: ['./team-predictions.component.css']
})
export class TeamPredictionsComponent implements OnInit, OnDestroy {

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private teamMatchService: TeamMatchService,
        private teamTeamMatchService: TeamTeamMatchService,
        private teamPredictionService: TeamPredictionService,
        private titleService: TitleService
    ) { }

    authenticatedUser: User = this.currentStateService.user;
    blockedTeamMatchFirst: TeamMatch = null;
    blockedTeamMatchSecond: TeamMatch = null;
    errorTeamMatches: string;
    errorTeamTeamMatches: string;
    errorTeamPredictions: string;
    isGoalkeeper: boolean;
    nextRound: string;
    noAccess: string = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
    oppositeTeamId: number;
    path: string = '/team/predictions/round/';
    previousRound: string;
    round: number;
    teamMatches: TeamMatch[];
    teamTeamMatches: TeamTeamMatch[];
    teamPredictions: TeamPrediction[];
    userSubscription: Subscription;

    getMyTeamMatchesData(round?: number) {
        let param = [{parameter: 'filter', value: 'opponents'}];
        if (round) param.push({parameter: 'round', value: round.toString()});
        this.teamMatchService.getTeamMatchesAuthUser(param).subscribe(
            response => {
                this.resetTeamMatchesData();
                if (response) {
                    this.teamMatches = response.team_matches;
                    this.setBlockedMatches(response.team_matches);
                }
            },
            error => {
                this.resetTeamMatchesData();
                this.errorTeamMatches = error;
            }
        );
    }

    getTeamGoalkeeperData() {
        if (this.teamTeamMatches && this.authenticatedUser) {
            this.getMyTeamMatchesData(this.round);
            for (let teamTeamMatch of this.teamTeamMatches) {
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
                this.getTeamTeamMatchesData(this.round);
                this.getTeamPredictionsData(this.round || null);
            }
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            this.round = params['round'] || null;
            this.resetTeamGoalkeeperData();
            if (this.authenticatedUser) {
                this.getTeamTeamMatchesData(params['round']);
                this.getTeamPredictionsData(params['round'] || null);
            }
        });
    }

    reloadTeamGoalkeeperData(): void {
        this.resetTeamGoalkeeperData();
        this.getTeamTeamMatchesData(this.round);
    }

    reloadTeamPredictionsData() {
        this.getTeamPredictionsData(this.round);
    }

    setBlockedMatches(teamMatches: TeamMatch[]) {
        for (let teamMatch of teamMatches) {
            if (teamMatch.team_predictions && teamMatch.team_predictions[0] && teamMatch.team_predictions[0].blocked_by) {
                if (!this.blockedTeamMatchFirst) {
                    this.blockedTeamMatchFirst = teamMatch;
                } else {
                    this.blockedTeamMatchSecond = teamMatch;
                }
            }
        }
    }

    private getTeamTeamMatchesData(round?: number) {
        this.teamTeamMatchService.getTeamTeamMatches(round).subscribe(
            response => {
                this.resetTeamMatchesData();
                if (response) {
                    this.teamTeamMatches = response.data;
                    this.nextRound = response.next_page_url;
                    this.previousRound = response.prev_page_url;
                    this.getTeamGoalkeeperData();
                }
            },
            error => {
                this.resetTeamMatchesData();
                this.errorTeamTeamMatches = error;
            }
        );
    }

    private getTeamPredictionsData(round?: number) {
        this.teamPredictionService.getTeamPredictions(round ? [{parameter: 'round', value: round.toString()}] : null)
            .subscribe(
                response => {
                    this.resetTeamPredictionsData();
                    if (response) {
                        this.teamPredictions = response.team_predictions;
                    }
                },
                error => {
                    this.resetTeamPredictionsData();
                    this.errorTeamPredictions = error;
                }
            );
    }

    private resetTeamPredictionsData(): void {
        this.teamPredictions = null;
        this.errorTeamPredictions = null;
    }

    private resetTeamMatchesData(): void {
        this.teamMatches = null;
        this.errorTeamMatches = null;
    }

    private resetTeamGoalkeeperData(): void {
        this.blockedTeamMatchFirst = null;
        this.blockedTeamMatchSecond = null;
        this.isGoalkeeper = false;
        this.oppositeTeamId = null;
    }
}
