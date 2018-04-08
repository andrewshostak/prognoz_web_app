import { Injectable }               from '@angular/core';
import { FormGroup }                from '@angular/forms';

import { ChampionshipPrediction }   from '../shared/models/championship-prediction.model';
import { TeamMatch }                from '../shared/models/team-match.model';
import { ChampionshipMatch }        from '../shared/models/championship-match.model';

@Injectable()

export class HelperService {

    constructor() { }

    /**
     * Check if score is present
     * @param home
     * @param away
     * @returns {boolean}
     */
    isScore(home: number, away: number) {
        if ((home != null) && (away != null)) {
            return true;
        }
        return false;
    }

    /**
     * Get item from local storage
     * @param {string} key
     * @returns {any}
     */
    getItemFromLocalStorage(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     * Returns user points of the match
     * @param resultHome
     * @param resultAway
     * @param predictHome
     * @param predictAway
     * @returns {number}
     */
    getUserPointsOnMatch(resultHome: number, resultAway:number , predictHome:number , predictAway:number) {
        let points = 0;
        switch (true) {
            // home team wins
            case resultHome > resultAway:
                if (predictHome > predictAway) {
                    switch (true) {
                        // full guessed (3 points)
                        case ((resultHome === predictHome) && (resultAway === predictAway)):
                            points = 3;
                            break;
                        // guessed goal difference
                        case ((resultHome - predictHome) === (resultAway - predictAway)):
                            points = 2;
                            break;
                        // guessed match winner
                        default:
                            points = 1;
                            break;
                    }
                }
                break;
            // away team wins
            case resultHome < resultAway:
                if (predictHome < predictAway) {
                    switch (true) {
                        // full guessed (3 points)
                        case ((resultHome === predictHome) && (resultAway === predictAway)):
                            points = 3;
                            break;
                            // guessed goal difference
                        case ((resultHome - predictHome) === (resultAway - predictAway)):
                            points = 2;
                            break;
                            // guessed match winner
                        default:
                            points = 1;
                            break;
                    }
                }
                break;
            case resultHome === resultAway:
                if (predictHome === predictAway) {
                    switch (true) {
                        // full guessed (3 points)
                        case ((resultHome === predictHome) && (resultAway === predictAway)):
                            points = 3;
                            break;
                        // guessed goal difference
                        case ((resultHome - predictHome) === (resultAway - predictAway)):
                            points = 2;
                            break;
                    }
                }
                break;
        }
        return points;
    }

    /**
     * Returns hometown or empty string
     * @param hometown
     * @returns {string}
     */
    getHometown(hometown: string | null) {
        return hometown ? '(' + hometown + ')' : '';
    }

    /**
     * Returns unsigned number
     * @param moving
     * @returns {number}
     */
    makeUnsigned(moving: number) {
        return Math.abs(moving);
    }

    /**
     * Show match scores or string from params
     * @param home
     * @param away
     * @param noScore
     * @returns {string}
     */
    showScore(home, away, noScore: string) {
        if ((home != null) && (away != null)) {
            return home + ' : ' + away;
        }

        return noScore;
    }

    /**
     * Receives form of championship predictions, validates it,
     * and returns ready to send array
     * @param championshipPredictionsForm
     * @returns {ChampionshipPrediction[]}
     */
    createChampionshipPredictionsArray(championshipPredictionsForm: FormGroup): ChampionshipPrediction[] {
        let championshipPredictionsToUpdate: ChampionshipPrediction[] = [];
        for (let championshipPrediction in championshipPredictionsForm.value) {
            let championshipMatchId = parseInt(championshipPrediction.split('_')[0]);
            // If there is no predictions on match
            if ((championshipPredictionsForm.value[championshipMatchId + '_home'] === null) &&
                (championshipPredictionsForm.value[championshipMatchId + '_away'] === null)) {
                continue;
            }
            // I don't know why I did that, but it works:
            let currentMatch = championshipPredictionsToUpdate.find(myObj => myObj.match_id === championshipMatchId);
            if (!currentMatch) {
                // If there is prediction only on home team
                if ((championshipPredictionsForm.value[championshipMatchId + '_home'] !== null) &&
                    (championshipPredictionsForm.value[championshipMatchId + '_away'] === null)) {
                    championshipPredictionsToUpdate.push({
                        match_id: championshipMatchId,
                        home: championshipPredictionsForm.value[championshipMatchId + '_home'],
                        away: 0
                    });
                    continue;
                }
                // If there is prediction only on away team
                if ((championshipPredictionsForm.value[championshipMatchId + '_home'] === null) &&
                    (championshipPredictionsForm.value[championshipMatchId + '_away'] !== null)) {
                    championshipPredictionsToUpdate.push({
                        match_id: championshipMatchId,
                        home: 0,
                        away: championshipPredictionsForm.value[championshipMatchId + '_away']
                    });
                    continue;
                }
                championshipPredictionsToUpdate.push({
                    match_id: championshipMatchId,
                    home: championshipPredictionsForm.value[championshipMatchId + '_home'],
                    away: championshipPredictionsForm.value[championshipMatchId + '_away']
                });
            }
        }

        return championshipPredictionsToUpdate;
    }

    /**
     * Is championship match guessed
     * @param championshipMatch
     * @param championshipPrediction
     * @returns {boolean}
     */
    isChampionshipMatchGuessed(championshipMatch: ChampionshipMatch,
                               championshipPrediction: ChampionshipPrediction): boolean {
        if (!championshipMatch.ended) {
            return false;
        }
        if (this.isScore(championshipPrediction.home, championshipPrediction.away)) {
            if (this.getUserPointsOnMatch(championshipMatch.home, championshipMatch.away,
                    championshipPrediction.home, championshipPrediction.away) === 3) {
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
    isTeamMatchGuessed(teamMatch: TeamMatch, teamId: number): boolean {
        if (!teamMatch.ended) return false;
        if (teamMatch.team_predictions) {
            let teamPrediction = teamMatch.team_predictions.find((teamPrediction) => teamId === teamPrediction.team_id);
            if (!teamPrediction) return false;
            if (this.getUserPointsOnMatch(teamMatch.home, teamMatch.away, teamPrediction.home, teamPrediction.away) === 3) {
                return true;
            }
        }

        return false;
    }

    /**
     * Is team match blocked
     * @param teamMatch
     * @param teamId
     * @returns {boolean}
     */
    isTeamMatchBlocked(teamMatch: TeamMatch, teamId: number): boolean {
        if (!teamMatch.ended) return false;
        if (teamMatch.team_predictions) {
            let teamPrediction = teamMatch.team_predictions.find((teamPrediction) => teamId === teamPrediction.team_id);
            if (!teamPrediction) return false;
            if (teamPrediction.blocked_by) return true;
        }

        return false;
    }

    /**
     * Is element in array of objects
     * @param array
     * @param property
     * @param value
     * @returns {boolean}
     */
    isElementInArray(array, property, value) {
        const element = array.find(item => item[property] === value);
        return !!element;
    }
}
