import { Injectable } from '@angular/core';

import { ChampionshipService } from '@services/championship/championship.service';
import { TeamMatch } from '@models/team/team-match.model';

@Injectable()
export class TeamCompetitionService {
    constructor() {}

    /**
     * Is team match blocked
     * @param teamMatch
     * @param teamId
     * @returns {boolean}
     */
    static isTeamMatchBlocked(teamMatch: TeamMatch, teamId: number): boolean {
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

    /**
     * Is team match guessed
     * @param teamMatch
     * @param teamId
     * @returns {boolean}
     */
    static isTeamMatchGuessed(teamMatch: TeamMatch, teamId: number): boolean {
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
