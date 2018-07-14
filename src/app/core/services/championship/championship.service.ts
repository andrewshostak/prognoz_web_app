import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { UtilsService } from '@services/utils.service';

@Injectable()
export class ChampionshipService {
    static readonly pointsFull: number = 3;
    static readonly pointsDiff: number = 2;
    static readonly pointsWinner: number = 1;
    static readonly noPoints: number = 0;

    constructor() {}

    /**
     * Returns user points of the match
     * @param resultHome
     * @param resultAway
     * @param predictHome
     * @param predictAway
     * @returns {number}
     */
    static getUserPointsOnMatch(resultHome: number, resultAway: number, predictHome: number, predictAway: number): number {
        switch (true) {
            // home team wins
            case resultHome > resultAway:
                if (predictHome > predictAway) {
                    switch (true) {
                        // full guessed (3 points)
                        case resultHome === predictHome && resultAway === predictAway:
                            return ChampionshipService.pointsFull;
                        // guessed goal difference
                        case resultHome - predictHome === resultAway - predictAway:
                            return ChampionshipService.pointsDiff;
                        // guessed match winner
                        default:
                            return ChampionshipService.pointsWinner;
                    }
                }
                break;
            // away team wins
            case resultHome < resultAway:
                if (predictHome < predictAway) {
                    switch (true) {
                        // full guessed (3 points)
                        case resultHome === predictHome && resultAway === predictAway:
                            return ChampionshipService.pointsFull;
                        // guessed goal difference
                        case resultHome - predictHome === resultAway - predictAway:
                            return ChampionshipService.pointsDiff;
                        // guessed match winner
                        default:
                            return ChampionshipService.pointsWinner;
                    }
                }
                break;
            case resultHome === resultAway:
                if (predictHome === predictAway) {
                    switch (true) {
                        // full guessed (3 points)
                        case resultHome === predictHome && resultAway === predictAway:
                            return ChampionshipService.pointsFull;
                        // guessed goal difference
                        case resultHome - predictHome === resultAway - predictAway:
                            return ChampionshipService.pointsDiff;
                    }
                }
                break;
        }

        return ChampionshipService.noPoints;
    }

    /**
     * Is championship match guessed
     * @param championshipMatch
     * @param championshipPrediction
     * @returns {boolean}
     */
    static isChampionshipMatchGuessed(championshipMatch: ChampionshipMatch, championshipPrediction: ChampionshipPrediction): boolean {
        if (!championshipMatch.ended) {
            return false;
        }
        if (UtilsService.isScore(championshipPrediction.home, championshipPrediction.away)) {
            if (
                ChampionshipService.getUserPointsOnMatch(
                    championshipMatch.home,
                    championshipMatch.away,
                    championshipPrediction.home,
                    championshipPrediction.away
                ) === ChampionshipService.pointsFull
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Receives form of championship predictions, validates it,
     * and returns ready to send array
     * @param championshipPredictionsForm
     * @returns {ChampionshipPrediction[]}
     */
    createChampionshipPredictionsArray(championshipPredictionsForm: FormGroup): ChampionshipPrediction[] {
        const championshipPredictionsToUpdate: ChampionshipPrediction[] = [];
        for (const championshipPrediction of Object.keys(championshipPredictionsForm.value)) {
            const championshipMatchId = parseInt(championshipPrediction.split('_')[0], 10);
            // If there is no predictions on match
            if (
                championshipPredictionsForm.value[championshipMatchId + '_home'] === null &&
                championshipPredictionsForm.value[championshipMatchId + '_away'] === null
            ) {
                continue;
            }
            // I don't know why I did that, but it works:
            const currentMatch = championshipPredictionsToUpdate.find(myObj => myObj.match_id === championshipMatchId);
            if (!currentMatch) {
                // If there is prediction only on home team
                if (
                    championshipPredictionsForm.value[championshipMatchId + '_home'] !== null &&
                    championshipPredictionsForm.value[championshipMatchId + '_away'] === null
                ) {
                    championshipPredictionsToUpdate.push({
                        match_id: championshipMatchId,
                        home: championshipPredictionsForm.value[championshipMatchId + '_home'],
                        away: 0
                    });
                    continue;
                }
                // If there is prediction only on away team
                if (
                    championshipPredictionsForm.value[championshipMatchId + '_home'] === null &&
                    championshipPredictionsForm.value[championshipMatchId + '_away'] !== null
                ) {
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
