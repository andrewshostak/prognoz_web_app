import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';
import { User } from '@models/v2/user.model';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { TeamMatch } from '@models/v1/team-match.model';
import { TeamParticipant } from '@models/v1/team-participant.model';
import { TeamParticipantSearch } from '@models/search/team/team-participant-search.model';
import { TeamTeamMatchSearch } from '@models/search/team/team-team-match-search.model';
import { AuthService } from '@services/v2/auth.service';
import { TeamCompetitionService } from '@services/v1/team-competition.service';
import { TeamParticipantService } from '@services/v2/team/team-participant.service';
import { TeamStageService } from '@services/v2/team/team-stage.service';
import { TeamTeamMatchService } from '@services/v2/team/team-team-match.service';
import { TeamMatchService } from '@services/v1/team-match.service';
import { TeamPredictionService } from '@services/v2/team/team-prediction.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { isEqual, sortBy } from 'lodash';

@Component({
   selector: 'app-team-captain',
   templateUrl: './team-captain.component.html',
   styleUrls: ['./team-captain.component.scss']
})
export class TeamCaptainComponent implements OnInit {
   constructor(
      private authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamMatchService: TeamMatchService,
      private teamParticipantService: TeamParticipantService,
      private teamPredictionService: TeamPredictionService,
      private teamStageService: TeamStageService,
      private teamTeamMatchService: TeamTeamMatchService
   ) {}

   authenticatedUser: User;
   public availableTeamParticipants: { [userId: number]: { predictionsLeft: number; participantAvailable: boolean } };
   currentTeamId: number;
   errorTeamMatches: string;
   errorTeamParticipants: string;
   errorTeamTeamMatches: string;
   goalkeeperId: number;
   isTeamMatchBlocked = TeamCompetitionService.isTeamMatchBlocked;
   isTeamMatchGuessed = TeamCompetitionService.isTeamMatchGuessed;
   isCaptain = false;
   teamStageId: number;
   showScoresOrString = UtilsService.showScoresOrString;
   spinnerButton: any = {};
   spinnerButtonGoalkeeper = false;
   teamMatches: TeamMatch[];
   teamParticipants: TeamParticipant[];
   teamTeamMatch: TeamTeamMatch;
   teamTeamMatchStates = TeamTeamMatchState;
   teamTeamMatches: TeamTeamMatch[];

   getCurrentTeamTeamMatch() {
      if (this.teamTeamMatches && this.currentTeamId) {
         for (const teamTeamMatch of this.teamTeamMatches) {
            if (this.currentTeamId === teamTeamMatch.home_team_id) {
               this.teamTeamMatch = teamTeamMatch;
               this.goalkeeperId = teamTeamMatch.home_team_goalkeeper_id;
               break;
            } else if (this.currentTeamId === teamTeamMatch.away_team_id) {
               this.teamTeamMatch = teamTeamMatch;
               this.goalkeeperId = teamTeamMatch.away_team_goalkeeper_id;
               break;
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

   ngOnInit() {
      this.authenticatedUser = this.authService.getUser();
      this.subscribeToTeamStageIdUrlParamChange();
   }

   setTeamTeamMatchGoalkeeper(teamGoalkeeperForm: NgForm) {
      if (teamGoalkeeperForm.valid) {
         this.spinnerButtonGoalkeeper = true;
         this.teamTeamMatchService.updateGoalkeeper(this.teamTeamMatch.id, teamGoalkeeperForm.value.goalkeeper_id).subscribe(
            () => {
               this.spinnerButtonGoalkeeper = false;
               this.goalkeeperId = teamGoalkeeperForm.value.goalkeeper_id;
               this.notificationsService.success('Успішно', 'Воротаря змінено');
            },
            () => {
               this.spinnerButtonGoalkeeper = false;
            }
         );
      }
   }

   updateOrCreateTeamPredictor(teamPredictorForm: NgForm, teamMatch: TeamMatch) {
      if (this.authenticatedUser && this.isCaptain) {
         this.spinnerButton['team_match_' + teamMatch.id] = true;
         const teamPrediction: { team_id: number; team_match_id: number; user_id?: number } = {
            team_id: this.currentTeamId,
            team_match_id: teamMatch.id
         };
         if (teamPredictorForm.value.user_id) {
            teamPrediction.user_id = parseInt(teamPredictorForm.value.user_id, 10);
         }
         this.teamPredictionService.updateUser(teamPrediction).subscribe(
            () => {
               this.notificationsService.success('Успішно', 'Прогнозиста вибрано');
               this.getMyTeamMatchesData(this.teamStageId);
               this.spinnerButton['team_match_' + teamMatch.id] = false;
            },
            () => {
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

   private getTeamParticipantsData(teamStageId: number) {
      const currenParticipantSearch = {
         teamStageId,
         userId: this.authenticatedUser.id,
         confirmed: ModelStatus.Truthy,
         page: 1,
         limit: 1
      } as TeamParticipantSearch;
      this.teamParticipantService
         .getTeamParticipants(currenParticipantSearch)
         .pipe(
            mergeMap(response => {
               if (!response.data.length) {
                  return of({ data: [] });
               }
               const search: TeamParticipantSearch = {
                  teamStageId,
                  teamId: response.data[0].team_id,
                  confirmed: ModelStatus.Truthy,
                  page: 1,
                  limit: SettingsService.maxLimitValues.teamParticipants
               };
               return this.teamParticipantService.getTeamParticipants(search);
            })
         )
         .subscribe(
            response => {
               this.errorTeamParticipants = null;
               if (!response.data.length) {
                  this.teamParticipants = null;
                  return;
               }

               if (!isEqual(response.data, this.teamParticipants)) {
                  this.teamParticipants = response.data;
               }
               this.currentTeamId = response.data[0].team_id;
               this.getTeamCaptain(response.data);
               this.getCurrentTeamTeamMatch();
            },
            error => {
               this.teamParticipants = null;
               this.currentTeamId = null;
               this.errorTeamParticipants = error;
            }
         );
   }

   private getMyTeamMatchesData(teamStageId: number) {
      const param = [
         { parameter: 'filter', value: 'my' },
         { parameter: 'team_stage_id', value: teamStageId.toString() }
      ];
      const requests = [
         this.teamMatchService.getTeamMatchesAuthUser(param),
         this.teamStageService.getTeamStage(teamStageId, ['teamStageType'])
      ];
      forkJoin(requests)
         .pipe(
            map(([teamMatchesResponse, teamStageResponse]) => {
               return { teamMatches: teamMatchesResponse, teamStage: teamStageResponse };
            }) as any
         )
         .subscribe(
            (responses: { teamMatches: any; teamStage: TeamStage }) => {
               this.errorTeamMatches = null;
               if (!responses.teamMatches) {
                  this.teamMatches = null;
                  return;
               }

               this.teamMatches = sortBy(responses.teamMatches.team_matches, ['starts_at', 'id']);
               this.availableTeamParticipants = this.getAvailableTeamParticipants(responses.teamMatches.team_matches, responses.teamStage);
               this.getCurrentTeamTeamMatch();
            },
            error => {
               this.teamMatches = null;
               this.errorTeamMatches = error;
            }
         );
   }

   private getTeamTeamMatchesData(teamStageId: number) {
      const search = { teamStageId, limit: SettingsService.maxLimitValues.teamTeamMatches, page: 1 } as TeamTeamMatchSearch;
      this.teamTeamMatchService.getTeamTeamMatches(search).subscribe(
         response => {
            this.errorTeamTeamMatches = null;
            if (!response || !response.data) {
               this.teamTeamMatches = null;
               return;
            }

            this.teamTeamMatches = response.data;
            this.getCurrentTeamTeamMatch();
         },
         error => {
            this.teamTeamMatches = null;
            this.errorTeamTeamMatches = error;
         }
      );
   }

   private getAvailableTeamParticipants(
      teamMatches: TeamMatch[],
      teamStage: TeamStage
   ): { [userId: number]: { predictionsLeft: number; participantAvailable: boolean } } {
      const teamParticipants: any = {};
      const maxParticipantNumberOfPredictions = Math.ceil(teamStage.team_stage_type.matches_count / SettingsService.participantsInTeam);
      teamMatches.forEach(teamMatch => {
         if (this.matchHasPrediction(teamMatch)) {
            if (!teamParticipants[teamMatch.team_predictions[0].user_id]) {
               teamParticipants[teamMatch.team_predictions[0].user_id] = {
                  predictionsLeft: maxParticipantNumberOfPredictions - 1,
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

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params
         .pipe(
            filter(params => params.team_stage_id),
            tap((params: Params) => {
               this.teamStageId = params.team_stage_id;
               this.getMyTeamMatchesData(params.team_stage_id);
               // TODO: why do we even need to call participants on each stage change
               // this endpoint returns always the same participants
               // (only if we navigate to team-stage in other competition)
               this.getTeamParticipantsData(params.team_stage_id);
               this.getTeamTeamMatchesData(params.team_stage_id);
            })
         )
         .subscribe();
   }
}
