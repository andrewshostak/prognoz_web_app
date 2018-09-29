import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { RequestParams } from '@models/request-params.model';
import { TeamCompetitionService } from '@services/team/team-competition.service';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamParticipant } from '@models/team/team-participant.model';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-captain',
    templateUrl: './team-captain.component.html',
    styleUrls: ['./team-captain.component.scss']
})
export class TeamCaptainComponent implements OnInit, OnDestroy {
    authenticatedUser: User = this.currentStateService.user;
    availableTeamParticipants: any;
    clubsImagesUrl: string = environment.apiImageClubs;
    competitionId: number;
    currentTeamId: number;
    errorTeamMatches: string;
    errorTeamParticipants: string;
    errorTeamTeamMatches: string;
    goalkeeperId: number;
    isTeamMatchBlocked = TeamCompetitionService.isTeamMatchBlocked;
    isTeamMatchGuessed = TeamCompetitionService.isTeamMatchGuessed;
    isCaptain = false;
    routerEventsSubscription: Subscription;
    round: number;
    showScoresOrString = UtilsService.showScoresOrString;
    spinnerButton: any = {};
    spinnerButtonGoalkeeper = false;
    teamEnvironment = environment.tournaments.team;
    teamMatches: TeamMatch[];
    teamParticipants: TeamParticipant[];
    teamTeamMatch: TeamTeamMatch;
    teamTeamMatches: TeamTeamMatch[];
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private router: Router,
        private teamMatchService: TeamMatchService,
        private teamParticipantService: TeamParticipantService,
        private teamPredictionService: TeamPredictionService,
        private teamTeamMatchService: TeamTeamMatchService
    ) {
        this.urlChanged(this.router.url);
        this.subscribeToRouterEvents();
    }

    getCurrentTeamTeamMatch() {
        if (this.teamTeamMatches && this.currentTeamId) {
            for (const teamTeamMatch of this.teamTeamMatches) {
                if (this.currentTeamId === teamTeamMatch.home_team_id) {
                    this.teamTeamMatch = teamTeamMatch;
                    this.goalkeeperId = teamTeamMatch.home_team_goalkeeper_id;
                } else if (this.currentTeamId === teamTeamMatch.away_team_id) {
                    this.teamTeamMatch = teamTeamMatch;
                    this.goalkeeperId = teamTeamMatch.away_team_goalkeeper_id;
                }
            }
        }
    }

    getPredictionDetails(teamMatch: TeamMatch, teamId: number): { name: string; prediction: string; predicted_at: string } {
        // not the same function as in team-team-match-card component - no is predictable check
        if (teamMatch.team_predictions) {
            const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
            if (teamPrediction) {
                return {
                    name: teamPrediction.user ? teamPrediction.user.name : '-',
                    prediction: UtilsService.isScore(teamPrediction.home, teamPrediction.away)
                        ? `${teamPrediction.home} : ${teamPrediction.away}`
                        : '-',
                    predicted_at: UtilsService.isScore(teamPrediction.home, teamPrediction.away) ? teamPrediction.predicted_at : '-'
                };
            }
        }
        return { name: '-', prediction: '-', predicted_at: '-' };
    }

    matchHasPrediction(teamMatch: TeamMatch): boolean {
        return teamMatch.team_predictions[0] && teamMatch.team_predictions[0].user_id;
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
            if (response && this.competitionId) {
                this.getMyTeamMatchesData(this.competitionId, this.round);
                this.getTeamParticipantsData(this.competitionId);
                this.getTeamTeamMatchesData(this.competitionId, this.round);
            }
        });
    }

    setTeamTeamMatchGoalkeeper(teamGoalkeeperForm: NgForm) {
        if (teamGoalkeeperForm.valid) {
            this.spinnerButtonGoalkeeper = true;
            const teamId = this.teamParticipants[0].team_id;
            const teamTeamMatchToUpdate = Object.assign({}, this.teamTeamMatch);

            if (teamTeamMatchToUpdate.home_team_id === teamId) {
                teamTeamMatchToUpdate.home_team_goalkeeper_id = teamGoalkeeperForm.value.goalkeeper_id;
            } else if (teamTeamMatchToUpdate.away_team_id === teamId) {
                teamTeamMatchToUpdate.away_team_goalkeeper_id = teamGoalkeeperForm.value.goalkeeper_id;
            }

            this.teamTeamMatchService.updateTeamTeamMatch(teamTeamMatchToUpdate).subscribe(
                response => {
                    this.spinnerButtonGoalkeeper = false;
                    if (!response) {
                        return;
                    }

                    this.teamTeamMatch = response;
                    this.goalkeeperId = teamGoalkeeperForm.value.goalkeeper_id;
                    this.notificationsService.success('Успішно', 'Воротаря змінено');
                },
                errors => {
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                    this.spinnerButtonGoalkeeper = false;
                    this.teamTeamMatch = null;
                }
            );
        }
    }

    updateOrCreateTeamPredictor(teamPredictorForm: NgForm, teamMatch: TeamMatch) {
        if (this.authenticatedUser && this.isCaptain) {
            this.spinnerButton['team_match_' + teamMatch.id] = true;
            const teamPrediction = {
                id: this.matchHasPrediction(teamMatch) ? teamMatch.team_predictions[0].id : null,
                team_id: this.currentTeamId,
                team_match_id: teamMatch.id,
                user_id: teamPredictorForm.value.user_id ? teamPredictorForm.value.user_id : null
            };
            this.teamPredictionService.updateTeamPrediction(teamPrediction).subscribe(
                response => {
                    this.notificationsService.success('Успішно', 'Прогнозиста вибрано');
                    this.getMyTeamMatchesData(this.competitionId, this.round);
                    this.spinnerButton['team_match_' + teamMatch.id] = false;
                },
                errors => {
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                    this.spinnerButton['team_match_' + teamMatch.id] = false;
                }
            );
        }
    }

    private getTeamCaptain(teamParticipants: TeamParticipant[]) {
        if (this.authenticatedUser) {
            teamParticipants.forEach(teamParticipant => {
                if (teamParticipant.captain && teamParticipant.user_id === this.authenticatedUser.id) {
                    this.isCaptain = true;
                }
            });
        }
    }

    private getMyTeamMatchesData(competitionId: number, round?: number) {
        const param = [{ parameter: 'filter', value: 'my' }, { parameter: 'competition_id', value: competitionId.toString() }];
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
                this.availableTeamParticipants = this.setAvailableTeamParticipants(response.team_matches);
                this.getCurrentTeamTeamMatch();
            },
            error => {
                this.teamMatches = null;
                this.errorTeamMatches = error;
            }
        );
    }

    private getTeamParticipantsData(competitionId: number) {
        const param = [{ parameter: 'competition_id', value: competitionId.toString() }, { parameter: 'current', value: 'true' }];
        this.teamParticipantService.getCurrentTeamParticipants(param).subscribe(
            response => {
                this.errorTeamParticipants = null;
                if (!response) {
                    this.teamParticipants = null;
                    return;
                }

                this.teamParticipants = response.team_participants;
                this.currentTeamId = response.team_participants[0].team_id;
                this.getTeamCaptain(response.team_participants);
                this.getCurrentTeamTeamMatch();
            },
            error => {
                this.teamParticipants = null;
                this.currentTeamId = null;
                this.errorTeamParticipants = error;
            }
        );
    }

    private getTeamTeamMatchesData(competitionId: number, round?: number) {
        const params: RequestParams[] = [{ parameter: 'competition_id', value: competitionId.toString() }];
        if (round) {
            params.push({ parameter: 'page', value: round.toString() });
        }
        this.teamTeamMatchService.getTeamTeamMatches(params).subscribe(
            response => {
                this.errorTeamTeamMatches = null;
                if (!response || !response.data) {
                    this.teamTeamMatches = null;
                    return;
                }

                this.getCurrentTeamTeamMatch();
                this.teamTeamMatches = response.data;
            },
            error => {
                this.teamTeamMatches = null;
                this.errorTeamTeamMatches = error;
            }
        );
    }

    private setAvailableTeamParticipants(teamMatches: TeamMatch[]) {
        const teamParticipants: any = {};
        const initialParticipantNumberOfPredictions = this.teamEnvironment.matchesInRound / this.teamEnvironment.participantsInTeam;
        teamMatches.forEach(teamMatch => {
            if (this.matchHasPrediction(teamMatch)) {
                if (!teamParticipants[teamMatch.team_predictions[0].user_id]) {
                    teamParticipants[teamMatch.team_predictions[0].user_id] = {
                        predictionsLeft: initialParticipantNumberOfPredictions - 1,
                        participantAvailable: true
                    };
                } else {
                    const predictionsLeft = teamParticipants[teamMatch.team_predictions[0].user_id].predictionsLeft;
                    teamParticipants[teamMatch.team_predictions[0].user_id].predictionsLeft = predictionsLeft - 1;
                    if (teamParticipants[teamMatch.team_predictions[0].user_id].predictionsLeft === 0) {
                        teamParticipants[teamMatch.team_predictions[0].user_id].participantAvailable = false;
                    }
                }
            }
        });

        return teamParticipants;
    }

    private subscribeToRouterEvents(): void {
        this.routerEventsSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.urlChanged(event.url);
            }
        });
    }

    private urlChanged(url: string): void {
        if (!this.authenticatedUser) {
            return;
        }

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

        this.getMyTeamMatchesData(this.competitionId, this.round);
        this.getTeamParticipantsData(this.competitionId);
        this.getTeamTeamMatchesData(this.competitionId, this.round);
    }
}
