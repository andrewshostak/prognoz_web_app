import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { User } from '@models/v2/user.model';
import { RequestParams } from '@models/request-params.model';
import { TeamTeamMatchSearch } from '@models/search/team/team-team-match-search.model';
import { TeamMatch } from '@models/v1/team-match.model';
import { TeamPrediction as TeamPredictionV1 } from '@models/v1/team-prediction.model';
import { TeamPrediction } from '@models/v2/team/team-prediction.model';
import { CurrentStateService } from '@services/current-state.service';
import { TeamTeamMatchService } from '@services/api/v2/team/team-team-match.service';
import { PaginationService } from '@services/pagination.service';
import { TeamMatchService } from '@services/api/v1/team-match.service';
import { TeamPredictionService } from '@services/api/v1/team-prediction.service';
import { TitleService } from '@services/title.service';
import { filter, tap } from 'rxjs/operators';
import { TeamStageService } from '@services/api/v2/team/team-stage.service';

@Component({
   selector: 'app-team-predictions',
   templateUrl: './team-predictions.component.html',
   styleUrls: ['./team-predictions.component.scss']
})
export class TeamPredictionsComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamMatchService: TeamMatchService,
      private teamTeamMatchService: TeamTeamMatchService,
      private teamPredictionService: TeamPredictionService,
      private teamStageService: TeamStageService,
      private titleService: TitleService
   ) {}

   public authenticatedUser: User;
   blockedTeamMatches: { teamMatch: TeamMatch; isBlocked: boolean }[] = [];
   blocksCount: number = 0;
   isGoalkeeper: boolean;
   noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
   currentTeamId: number;
   teamTeamMatchId: number;
   public teamStageId: number;
   teamMatches: TeamMatch[];
   public teamTeamMatches: TeamTeamMatch[];
   teamPredictions: TeamPredictionV1[];

   public clickOnTeamStageSelectButton(event: { teamStageId: number }): void {
      this.router.navigate(['/team', 'predictions', { team_stage_id: event.teamStageId }]);
   }

   getMyTeamMatchesData(teamStageId: number) {
      const param = [
         { parameter: 'filter', value: 'opponents' },
         { parameter: 'team_stage_id', value: teamStageId.toString() }
      ];
      this.teamMatchService.getTeamMatchesAuthUser(param).subscribe(
         response => {
            if (!response) {
               this.teamMatches = null;
               return;
            }

            this.teamMatches = response.team_matches;
            this.setBlockedMatches(response.team_matches);
         },
         () => {
            this.teamMatches = null;
            this.resetTeamGoalkeeperData();
         }
      );
   }

   getTeamGoalkeeperData(teamStageId: number) {
      if (this.teamTeamMatches && this.authenticatedUser) {
         this.getMyTeamMatchesData(teamStageId);
         for (const teamTeamMatch of this.teamTeamMatches) {
            if (this.authenticatedUser.id === teamTeamMatch.home_team_goalkeeper_id) {
               this.teamTeamMatchId = teamTeamMatch.id;
               this.currentTeamId = teamTeamMatch.home_team_id;
               this.isGoalkeeper = true;
            } else if (this.authenticatedUser.id === teamTeamMatch.away_team_goalkeeper_id) {
               this.teamTeamMatchId = teamTeamMatch.id;
               this.currentTeamId = teamTeamMatch.away_team_id;
               this.isGoalkeeper = true;
            }
         }
      }
   }

   ngOnInit() {
      this.titleService.setTitle('Зробити прогнози - Командний');
      this.authenticatedUser = this.currentStateService.getUser();
      this.subscribeToTeamStageIdUrlParamChange();
   }

   predictionUpdated(event: {teamPredictionId: number, teamPrediction?: TeamPrediction, error?: { message: string; status_code: number };}): void {
      const found = this.teamPredictions.find(prediction => prediction.id === event.teamPredictionId);
      if (!found) return;

      event.teamPrediction
         ? Object.assign(found, event.teamPrediction as unknown as TeamPredictionV1)
         : event.error?.message.includes('Час для прогнозування вже вийшов') &&
         (found.team_match.is_predictable = false);
   }

   setBlockedMatches(teamMatches: TeamMatch[]) {
      teamMatches.forEach(teamMatch => {
         this.blockedTeamMatches.push({
            teamMatch,
            isBlocked: teamMatch.team_predictions && teamMatch.team_predictions[0] && !!teamMatch.team_predictions[0].blocked_at
         });
      });
      // for template updating
      this.blockedTeamMatches = [...this.blockedTeamMatches.sort(this.sortByStartDateFunc)];
   }

   private getTeamTeamMatchesData(teamStageId: number) {
      const search: TeamTeamMatchSearch = {
         limit: PaginationService.limit.teamTeamMatches,
         page: 1,
         teamStageId
      };
      this.teamTeamMatchService.getTeamTeamMatches(search).subscribe(response => {
         this.teamTeamMatches = response.data;
         this.getTeamGoalkeeperData(teamStageId);
      });
   }

   private getTeamPredictionsData(teamStageId: number) {
      const params: RequestParams[] = [{ parameter: 'team_stage_id', value: teamStageId.toString() }];
      this.teamPredictionService.getTeamPredictions(params).subscribe(
         response => {
            if (!response || !response.team_predictions) {
               this.teamPredictions = null;
               return;
            }

            this.teamPredictions = response.team_predictions;
         },
         () => (this.teamPredictions = null)
      );
   }

   private getTeamStageData(id: number): void {
      this.teamStageService.getTeamStage(id, ['teamStageType']).subscribe(response => {
         if (response.team_stage_type) {
            this.blocksCount = response.team_stage_type.blocks_count;
         }
      });
   }

   private resetTeamGoalkeeperData(): void {
      this.blockedTeamMatches = [];
      this.isGoalkeeper = false;
      this.currentTeamId = null;
   }

   private sortByStartDateFunc(a: { teamMatch: TeamMatch; isBlocked: boolean }, b: { teamMatch: TeamMatch; isBlocked: boolean }): number {
      return a.teamMatch.match.started_at < b.teamMatch.match.started_at ? -1 : 1;
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params
         .pipe(
            filter(params => params.team_stage_id),
            tap((params: Params) => {
               this.teamStageId = parseInt(params.team_stage_id, 10);
               this.resetTeamGoalkeeperData();
               this.getTeamTeamMatchesData(params.team_stage_id);
               this.getTeamPredictionsData(params.team_stage_id);
               this.getTeamStageData(params.team_stage_id);
            })
         )
         .subscribe();
   }
}
