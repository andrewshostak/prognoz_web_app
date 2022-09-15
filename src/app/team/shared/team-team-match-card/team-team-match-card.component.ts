import { Component, Input, ChangeDetectorRef } from '@angular/core';

import { TeamCompetitionService } from '@services/team/team-competition.service';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { TimePipe } from '@app/shared/pipes/time.pipe';
import { UtilsService } from '@services/utils.service';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { sortBy } from 'lodash';

@Component({
   selector: 'app-team-team-match-card',
   templateUrl: './team-team-match-card.component.html',
   styleUrls: ['./team-team-match-card.component.scss']
})
export class TeamTeamMatchCardComponent {
   constructor(private teamMatchService: TeamMatchService, private changeDetectorRef: ChangeDetectorRef, private timePipe: TimePipe) {}

   @Input() teamTeamMatch: TeamTeamMatchNew | TeamTeamMatch | any;

   detailsExpanded: boolean;
   errorTeamMatches: string;
   isTeamMatchBlocked = TeamCompetitionService.isTeamMatchBlocked;
   isTeamMatchGuessed = TeamCompetitionService.isTeamMatchGuessed;
   noTeamMatches = 'Цей раунд ще не почався / матчів не знайдено';
   showScoresOrString = UtilsService.showScoresOrString;
   spinnerTeamMatches: boolean;
   teamMatches: TeamMatch[];

   getTeamMatchesData(teamTeamMatch: TeamTeamMatchNew) {
      this.spinnerTeamMatches = true;
      const param = [
         { parameter: 'filter', value: 'team-team-match' },
         { parameter: 'team_stage_id', value: teamTeamMatch.team_stage_id.toString() }
      ];
      param.push({ parameter: 'home_team_id', value: teamTeamMatch.home_team_id.toString() });
      param.push({ parameter: 'away_team_id', value: teamTeamMatch.away_team_id.toString() });
      this.teamMatchService.getTeamMatches(param).subscribe(
         response => {
            if (response) {
               this.teamMatches = sortBy(response.team_matches, ['starts_at', 'id']);
            }
            this.spinnerTeamMatches = false;
         },
         error => {
            this.errorTeamMatches = error;
            this.spinnerTeamMatches = false;
         }
      );
   }

   getPredictionDetails(teamMatch: TeamMatch, teamId: number) {
      if (teamMatch.team_predictions) {
         const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
         if (teamPrediction) {
            return {
               user: teamPrediction.user || null,
               prediction: UtilsService.isScore(teamPrediction.home, teamPrediction.away)
                  ? {
                       home: teamPrediction.home,
                       away: teamPrediction.away,
                       short: teamPrediction.home + ':' + teamPrediction.away,
                       long: teamPrediction.home + ' : ' + teamPrediction.away
                    }
                  : null
            };
         }
      }
      return { user: null, prediction: null };
   }

   isTeamMatchPredictable(teamMatch: TeamMatch) {
      return teamMatch.is_predictable;
   }

   getTitle(teamMatch: TeamMatch, teamId: number): string {
      if (teamMatch.is_predictable) {
         return 'Прогнози гравців відображаються після початку другого тайму матчу';
      } else if (teamMatch.team_predictions) {
         const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
         if (teamPrediction) {
            if (!UtilsService.isScore(teamPrediction.home, teamPrediction.away)) {
               return 'Прогноз не зроблено';
            }
            const date = this.timePipe.transform(teamPrediction.predicted_at, 'YYYY-MM-DD HH:mm');
            return 'Прогноз зроблено ' + date;
         }
      }

      return 'Прогноз не зроблено';
   }

   toggleDetailsVisibility(): void {
      if (!this.detailsExpanded) {
         this.spinnerTeamMatches = true;
         this.getTeamMatchesData(this.teamTeamMatch as TeamTeamMatchNew);
      }

      this.detailsExpanded = !this.detailsExpanded;
   }
}
