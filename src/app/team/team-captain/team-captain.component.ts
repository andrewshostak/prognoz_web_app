import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm }                       from '@angular/forms';
import { ActivatedRoute, Params }       from '@angular/router';
import { Subscription }                 from 'rxjs/Subscription';

import { AuthService }                  from '../../core/auth.service';
import { CurrentStateService }          from '../../core/current-state.service';
import { environment }                  from '../../../environments/environment';
import { HelperService }                from '../../core/helper.service';
import { NotificationsService }         from 'angular2-notifications';
import { TeamMatch }                    from '../../shared/models/team-match.model';
import { TeamMatchService }             from '../shared/team-match.service';
import { TeamParticipant }              from '../../shared/models/team-participant.model';
import { TeamParticipantService }       from '../shared/team-participant.service';
import { TeamPredictionService }        from '../shared/team-prediction.service';
import { TeamTeamMatch }                from '../../shared/models/team-team-match.model';
import { TeamTeamMatchService }         from '../shared/team-team-match.service';
import { User }                         from '../../shared/models/user.model';

@Component({
    selector: 'app-team-captain',
    templateUrl: './team-captain.component.html',
    styleUrls: ['./team-captain.component.css']
})
export class TeamCaptainComponent implements OnInit, OnDestroy {

    authenticatedUser: User = this.currentStateService.user;
    availableTeamParticipants: any;
    clubsImagesUrl: string = environment.apiImageClubs;
    currentTeamId: number;
    errorTeamMatches: string;
    errorTeamParticipants: string;
    errorTeamTeamMatches: string;
    goalkeeperId: number;
    isCaptain: boolean = false;
    round: number;
    spinnerButton: any = {};
    spinnerButtonGoalkeeper: boolean = false;
    teamEnvironment = environment.tournaments.team;
    teamMatches: TeamMatch[];
    teamParticipants: TeamParticipant[];
    teamTeamMatch: TeamTeamMatch;
    teamTeamMatches: TeamTeamMatch[];
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        public helperService: HelperService,
        private notificationService: NotificationsService,
        private teamMatchService: TeamMatchService,
        private teamParticipantService: TeamParticipantService,
        private teamPredictionService: TeamPredictionService,
        private teamTeamMatchService: TeamTeamMatchService
    ) {}

    getCurrentTeamTeamMatch() {
        if (this.teamTeamMatches && this.currentTeamId) {
            for (let teamTeamMatch of this.teamTeamMatches) {
                if (this.currentTeamId === teamTeamMatch.home_team_id) {
                    this.teamTeamMatch = teamTeamMatch;
                    if (!this.goalkeeperId) this.goalkeeperId = teamTeamMatch.home_team_goalkeeper_id;
                } else if (this.currentTeamId === teamTeamMatch.away_team_id) {
                    this.teamTeamMatch = teamTeamMatch;
                    if (!this.goalkeeperId) this.goalkeeperId = teamTeamMatch.away_team_goalkeeper_id;
                }
            }
        }
    }

    getPredictionDetails(teamMatch: TeamMatch, teamId: number): {name: string, prediction: string, predicted_at: string} {
        // not the same function as in team-team-match-card component - no is predictable check
        if (teamMatch.team_predictions) {
            let teamPrediction = teamMatch.team_predictions.find((teamPrediction) => teamId === teamPrediction.team_id);
            if (teamPrediction) {
                return {
                    name: teamPrediction.user ? teamPrediction.user.name : '-',
                    prediction: this.helperService.isScore(teamPrediction.home, teamPrediction.away)
                        ? `${teamPrediction.home} : ${teamPrediction.away}` : '-',
                    predicted_at: this.helperService.isScore(teamPrediction.home, teamPrediction.away)
                        ? teamPrediction.predicted_at : '-'
                };
            }
        }
        return {name: '-', prediction: '-', predicted_at: '-'};
    }

    matchHasPrediction(teamMatch: TeamMatch): boolean {
        return teamMatch.team_predictions[0] && teamMatch.team_predictions[0].user_id;
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            if (response) {
                this.getMyTeamMatchesData(this.round || null);
                this.getTeamParticipantsData();
                this.getTeamTeamMatchesData(this.round || null);
            }
        });
        this.activatedRoute.params.subscribe((params: Params) => {
            this.round = params['round'] || null;
            if (this.authenticatedUser) {
                this.getMyTeamMatchesData(params['round'] || null);
                this.getTeamParticipantsData();
                this.getTeamTeamMatchesData(params['round'] || null);
            }
        });
    }

    setTeamTeamMatchGoalkeeper(teamGoalkeeperForm: NgForm) {
        if (teamGoalkeeperForm.valid) {
            this.spinnerButtonGoalkeeper = true;
            let teamId = this.teamParticipants[0].team_id;
            let teamTeamMatchToUpdate = Object.assign({}, this.teamTeamMatch);

            if (teamTeamMatchToUpdate.home_team_id === teamId) {
                teamTeamMatchToUpdate.home_team_goalkeeper_id = teamGoalkeeperForm.value.goalkeeper_id;
            } else if (teamTeamMatchToUpdate.away_team_id === teamId) {
                teamTeamMatchToUpdate.away_team_goalkeeper_id = teamGoalkeeperForm.value.goalkeeper_id;
            }

            this.teamTeamMatchService.updateTeamTeamMatch(teamTeamMatchToUpdate).subscribe(
                response => {
                    if (response) {
                        this.teamTeamMatch = response;
                        this.goalkeeperId = teamGoalkeeperForm.value.goalkeeper_id;
                    }
                    this.notificationService.success('Успішно', 'Воротаря змінено');
                    this.spinnerButtonGoalkeeper = false;
                },
                errors => {
                    errors.forEach(error => this.notificationService.error('Помилка', error));
                    this.spinnerButtonGoalkeeper = false;
                }
            );
        }
    }

    updateOrCreateTeamPredictor(teamPredictorForm: NgForm, teamMatch: TeamMatch) {
        if (this.authenticatedUser && this.isCaptain) {
            this.spinnerButton['team_match_' + teamMatch.id] = true;
            let teamPrediction = {
                id: this.matchHasPrediction(teamMatch) ? teamMatch.team_predictions[0].id : null,
                team_id: this.currentTeamId,
                team_match_id: teamMatch.id,
                user_id: teamPredictorForm.value.user_id ? teamPredictorForm.value.user_id : null
            };
            this.teamPredictionService.updateTeamPrediction(teamPrediction).subscribe(
                response => {
                    this.notificationService.success('Успішно', 'Прогнозиста вибрано');
                    this.getMyTeamMatchesData(this.round);
                    this.spinnerButton['team_match_' + teamMatch.id] = false;
                },
                errors => {
                    errors.forEach(error => this.notificationService.error('Помилка', error));
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

    private getMyTeamMatchesData(round?: number) {
        let param = [{parameter: 'filter', value: 'my'}];
        if (round) param.push({parameter: 'round', value: round.toString()});
        this.teamMatchService.getTeamMatchesAuthUser(param).subscribe(
            response => {
                this.resetMyTeamMatchesData();
                if (response) {
                    this.teamMatches = response.team_matches;
                    this.availableTeamParticipants = this.setAvailableTeamParticipants(response.team_matches);
                    this.getCurrentTeamTeamMatch();
                }
            },
            error => {
                this.resetMyTeamMatchesData();
                this.errorTeamMatches = error;
            }
        );
    }

    private getTeamParticipantsData() {
        let param = [{parameter: 'current', value: 'true'}];
        this.teamParticipantService.getCurrentTeamParticipants(param)
            .subscribe(
                response => {
                    if (response) {
                        this.teamParticipants = response.team_participants;
                        this.currentTeamId = response.team_participants[0].team_id;
                        this.getTeamCaptain(response.team_participants);
                        this.getCurrentTeamTeamMatch();
                    }
                },
                error => {
                    this.errorTeamParticipants = error;
                }
            );
    }

    private getTeamTeamMatchesData(round?: number) {
        this.teamTeamMatchService.getTeamTeamMatches(round).subscribe(
            response => {
                if (response) {
                    this.getCurrentTeamTeamMatch();
                    this.teamTeamMatches = response.data;
                }
            },
            error => {
                this.errorTeamTeamMatches = error;
            }
        );
    }

    private resetMyTeamMatchesData(): void {
        this.teamMatches = null;
        this.errorTeamMatches = null
    }

    private setAvailableTeamParticipants(teamMatches: TeamMatch[]) {
        let teamParticipants: any = {};
        let initialParticipantNumberOfPredictions = this.teamEnvironment.matchesInRound / this.teamEnvironment.participantsInTeam;
        teamMatches.forEach(teamMatch => {
            if (this.matchHasPrediction(teamMatch)) {
                if (!teamParticipants[teamMatch.team_predictions[0].user_id]) {
                    teamParticipants[teamMatch.team_predictions[0].user_id] = {
                        predictionsLeft: initialParticipantNumberOfPredictions - 1,
                        participantAvailable: true
                    };
                } else {
                    let predictionsLeft = teamParticipants[teamMatch.team_predictions[0].user_id].predictionsLeft;
                    teamParticipants[teamMatch.team_predictions[0].user_id].predictionsLeft = predictionsLeft - 1;
                    if (teamParticipants[teamMatch.team_predictions[0].user_id].predictionsLeft === 0) {
                        teamParticipants[teamMatch.team_predictions[0].user_id].participantAvailable = false;
                    }
                }
            }
        });

        return teamParticipants;
    }
}
