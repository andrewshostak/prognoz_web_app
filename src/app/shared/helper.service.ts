import { Injectable }               from '@angular/core';
import { FormGroup }                from '@angular/forms';

import { ChampionshipPrediction }   from './models/championship-prediction.model';

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
}
