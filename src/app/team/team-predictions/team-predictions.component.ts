import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { UserNew } from '@models/new/user-new.model';
import { RequestParams } from '@models/request-params.model';
import { TeamTeamMatchSearch } from '@models/search/team-team-match-search.model';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamPrediction } from '@models/team/team-prediction.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TitleService } from '@services/title.service';
import { filter, tap } from 'rxjs/operators';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { range } from 'lodash';

@Component({
   selector: 'app-team-predictions',
   templateUrl: './team-predictions.component.html',
   styleUrls: ['./team-predictions.component.scss']
})
export class TeamPredictionsComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private router: Router,
      private teamMatchService: TeamMatchService,
      private teamTeamMatchService: TeamTeamMatchNewService,
      private teamPredictionService: TeamPredictionService,
      private teamStageService: TeamStageNewService,
      private titleService: TitleService
   ) {}

   public authenticatedUser: UserNew;
   public blockedTeamMatches: TeamMatch[] = [];
   public possibleBlockedTeamMatchesIndexes: number[] = [];
   isGoalkeeper: boolean;
   noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
   oppositeTeamId: number;
   public teamStageId: number;
   teamMatches: TeamMatch[];
   public teamTeamMatches: TeamTeamMatchNew[];
   teamPredictions: TeamPrediction[];

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
               this.oppositeTeamId = teamTeamMatch.away_team_id;
               this.isGoalkeeper = true;
            } else if (this.authenticatedUser.id === teamTeamMatch.away_team_goalkeeper_id) {
               this.oppositeTeamId = teamTeamMatch.home_team_id;
               this.isGoalkeeper = true;
            }
         }
      }
   }

   ngOnInit() {
      this.titleService.setTitle('Зробити прогнози - Командний');
      this.authenticatedUser = this.authService.getUser();
      this.subscribeToTeamStageIdUrlParamChange();
   }

   reloadTeamGoalkeeperData(): void {
      this.resetTeamGoalkeeperData();
      this.getTeamTeamMatchesData(this.teamStageId);
   }

   reloadTeamPredictionsData() {
      this.getTeamPredictionsData(this.teamStageId);
   }

   setBlockedMatches(teamMatches: TeamMatch[]) {
      // todo: "nothing blocked" message is shown after blocking a match
      for (const teamMatch of teamMatches) {
         if (teamMatch.team_predictions && teamMatch.team_predictions[0] && teamMatch.team_predictions[0].blocked_by) {
            this.blockedTeamMatches.push(teamMatch);
         }
      }
   }

   private getTeamTeamMatchesData(teamStageId: number) {
      const search: TeamTeamMatchSearch = {
         limit: SettingsService.maxLimitValues.teamTeamMatches,
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
      this.teamStageService.getTeamStage(id).subscribe(response => {
         if (response.team_stage_type) {
            this.possibleBlockedTeamMatchesIndexes = range(response.team_stage_type.blocks_count);
         }
      });
   }

   private resetTeamGoalkeeperData(): void {
      this.blockedTeamMatches = [];
      this.isGoalkeeper = false;
      this.oppositeTeamId = null;
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
            }) as any
         )
         .subscribe();
   }
}
