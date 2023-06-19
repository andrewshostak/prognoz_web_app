import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { TimePipe } from '@app/shared/pipes/time.pipe';
import { Sequence } from '@enums/sequence.enum';
import { TeamPrediction } from '@models/v2/team/team-prediction.model';
import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { TeamMatch } from '@models/v2/team/team-match.model';
import { TeamMatchSearch } from '@models/search/team/team-match-search.model';
import { TeamPredictionSearch } from '@models/search/team/team-prediction-search.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamCompetitionService } from '@services/v2/team/team-competition.service';
import { TeamMatchService } from '@services/v2/team/team-match.service';
import { TeamPredictionService } from '@services/v2/team/team-prediction.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { TeamMatchAndEnrichedPredictions } from '@team/shared/team-team-match-card/team-match-and-enriched-predictions.model';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-team-team-match-card',
   templateUrl: './team-team-match-card.component.html'
})
export class TeamTeamMatchCardComponent {
   constructor(
      private teamMatchService: TeamMatchService,
      private teamPredictionService: TeamPredictionService,
      private changeDetectorRef: ChangeDetectorRef,
      private timePipe: TimePipe
   ) {}

   @Input() teamTeamMatch: TeamTeamMatch;

   detailsExpanded: boolean;
   noTeamMatches = 'Цей раунд ще не почався / матчів не знайдено';
   spinnerTeamMatches: boolean;
   teamMatchesForTemplate: TeamMatchAndEnrichedPredictions[] = [];

   toggleDetailsVisibility(): void {
      if (!this.detailsExpanded) {
         this.getData(this.teamTeamMatch as TeamTeamMatch);
      }

      this.detailsExpanded = !this.detailsExpanded;
   }

   private getIdsWithViewablePredictions(teamMatches: TeamMatch[]): number[] {
      return teamMatches.filter(teamMatch => teamMatch.are_predictions_viewable).map(teamMatch => teamMatch.id);
   }

   private getData(teamTeamMatch: TeamTeamMatch) {
      this.spinnerTeamMatches = true;
      this.getTeamMatchesAndPredictions(teamTeamMatch).subscribe(
         response => {
            const teamMatchesForTemplate = this.joinMatchesAndPredictions(
               response.teamTeamMatch,
               response.teamMatches,
               response.teamPredictions
            );
            this.teamMatchesForTemplate = this.enrichPredictionsData(teamMatchesForTemplate);
            this.spinnerTeamMatches = false;
         },
         () => (this.spinnerTeamMatches = false)
      );
   }

   private getTeamMatches(teamStageId: number): Observable<PaginatedResponse<TeamMatch>> {
      const search: TeamMatchSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.teamMatches,
         orderBy: 'started_at',
         sequence: Sequence.Ascending,
         relations: ['match.clubHome', 'match.clubAway'],
         showPredictionsViewability: true,
         teamStageId
      };
      return this.teamMatchService.getTeamMatches(search);
   }

   private getTeamMatchesAndPredictions(
      teamTeamMatch: TeamTeamMatch
   ): Observable<{ teamTeamMatch: TeamTeamMatch; teamMatches: TeamMatch[]; teamPredictions: TeamPrediction[] }> {
      const noDataResponse = { data: [], total: 0 } as PaginatedResponse<any>;
      return this.getTeamMatches(teamTeamMatch.team_stage_id).pipe(
         catchError(() => of(noDataResponse)),
         mergeMap(teamMatchesResponse => {
            const teamMatchIds = this.getIdsWithViewablePredictions(teamMatchesResponse.data);
            if (!teamMatchIds.length) {
               return of({ teamTeamMatch, teamMatches: teamMatchesResponse.data, teamPredictions: [] });
            }
            const teamIds = [teamTeamMatch.home_team_id, teamTeamMatch.away_team_id];
            return this.getTeamPredictions(teamIds, teamMatchIds).pipe(
               catchError(() => of(noDataResponse)),
               map(teamPredictionsResponse => {
                  return { teamTeamMatch, teamMatches: teamMatchesResponse.data, teamPredictions: teamPredictionsResponse.data };
               })
            );
         })
      ) as Observable<{ teamTeamMatch: TeamTeamMatch; teamMatches: TeamMatch[]; teamPredictions: TeamPrediction[] }>;
   }

   private getTeamPredictions(teamIds: number[], teamMatchIds: number[]): Observable<PaginatedResponse<TeamPrediction>> {
      const search: TeamPredictionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.teamPredictions,
         orderBy: 'team_match_id',
         sequence: Sequence.Ascending,
         teamIds,
         teamMatchIds,
         relations: ['user']
      };
      return this.teamPredictionService.getTeamPredictions(search);
   }

   private getPredictionTitle(teamMatch: TeamMatch, prediction: TeamPrediction): string {
      if (!teamMatch.are_predictions_viewable) {
         return 'Прогнози гравців відображаються після початку другого тайму матчу';
      }

      if (!prediction) {
         return 'Прогноз не зроблено';
      }

      if (!UtilsService.isScore(prediction.home, prediction.away)) {
         return 'Прогноз не зроблено';
      }

      const date = this.timePipe.transform(prediction.predicted_at, 'YYYY-MM-DD HH:mm');
      return 'Прогноз зроблено ' + date;
   }

   private joinMatchesAndPredictions(
      teamTeamMatch: TeamTeamMatch,
      teamMatches: TeamMatch[],
      teamPredictions: TeamPrediction[]
   ): TeamMatchAndEnrichedPredictions[] {
      return teamMatches.map(teamMatch => {
         const predictions = teamPredictions.filter(teamPrediction => teamPrediction.team_match_id === teamMatch.id);
         return {
            teamMatch,
            homePrediction: { prediction: predictions.find(prediction => teamTeamMatch.home_team_id === prediction.team_id) },
            awayPrediction: { prediction: predictions.find(prediction => teamTeamMatch.away_team_id === prediction.team_id) }
         };
      });
   }

   private enrichPredictionsData(teamMatches: TeamMatchAndEnrichedPredictions[]): TeamMatchAndEnrichedPredictions[] {
      return teamMatches.map(teamMatch => {
         teamMatch.homePredictionTitle = this.getPredictionTitle(teamMatch.teamMatch, teamMatch.homePrediction.prediction);
         teamMatch.homePrediction.guessed = TeamCompetitionService.isTeamMatchGuessed(
            teamMatch.teamMatch,
            teamMatch.homePrediction.prediction
         );
         teamMatch.homePrediction.blocked = TeamCompetitionService.isTeamMatchBlocked(
            teamMatch.teamMatch,
            teamMatch.homePrediction.prediction
         );

         teamMatch.awayPredictionTitle = this.getPredictionTitle(teamMatch.teamMatch, teamMatch.awayPrediction.prediction);
         teamMatch.awayPrediction.guessed = TeamCompetitionService.isTeamMatchGuessed(
            teamMatch.teamMatch,
            teamMatch.awayPrediction.prediction
         );
         teamMatch.awayPrediction.blocked = TeamCompetitionService.isTeamMatchBlocked(
            teamMatch.teamMatch,
            teamMatch.awayPrediction.prediction
         );

         return teamMatch;
      });
   }
}
