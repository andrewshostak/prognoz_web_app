import { Injectable } from '@angular/core';

import { MatchState } from '@enums/match-state.enum';
import { TeamMatch } from '@models/v1/team-match.model';
import { ChampionshipService } from '@services/championship/championship.service';

@Injectable()
/**
 * @deprecated use v2 TeamCompetitionService
 */
export class TeamCompetitionService {
   public static isTeamMatchBlocked(teamMatch: TeamMatch, teamId: number): boolean {
      if (teamMatch.match.state !== MatchState.Ended) {
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
      if (teamMatch.match.state !== MatchState.Ended) {
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
