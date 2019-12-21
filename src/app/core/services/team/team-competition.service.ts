import { Injectable } from '@angular/core';

import { TeamMatch } from '@models/team/team-match.model';
import { ChampionshipService } from '@services/championship/championship.service';

@Injectable()
export class TeamCompetitionService {
   public static isTeamMatchBlocked(teamMatch: TeamMatch, teamId: number): boolean {
      if (!teamMatch.ended) {
         return false;
      }
      if (teamMatch.team_predictions) {
         const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
         if (!teamPrediction) {
            return false;
         }
         if (teamPrediction.blocked_by) {
            return true;
         }
      }

      return false;
   }

   public static isTeamMatchGuessed(teamMatch: TeamMatch, teamId: number): boolean {
      if (!teamMatch.ended) {
         return false;
      }
      if (teamMatch.team_predictions) {
         const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
         if (!teamPrediction) {
            return false;
         }
         if (
            ChampionshipService.getUserPointsOnMatch(teamMatch.home, teamMatch.away, teamPrediction.home, teamPrediction.away) ===
            ChampionshipService.pointsFull
         ) {
            return true;
         }
      }

      return false;
   }
}
