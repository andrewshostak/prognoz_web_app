import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { UtilsService } from '@services/utils.service';
import { Award } from '@models/v2/award.model';

@Injectable()
export class ChampionshipCompetitionService {
   public static readonly pointsFull: number = 3;
   public static readonly pointsDiff: number = 2;
   public static readonly pointsWinner: number = 1;
   public static readonly noPoints: number = 0;

   /**
    * Returns user points of the match
    * @param resultHome
    * @param resultAway
    * @param predictHome
    * @param predictAway
    * @returns {number}
    */
   public static getUserPointsOnMatch(resultHome: number, resultAway: number, predictHome: number, predictAway: number): number {
      switch (true) {
         // home team wins
         case resultHome > resultAway:
            if (predictHome > predictAway) {
               switch (true) {
                  // full guessed (3 points)
                  case resultHome === predictHome && resultAway === predictAway:
                     return ChampionshipCompetitionService.pointsFull;
                  // guessed goal difference
                  case resultHome - predictHome === resultAway - predictAway:
                     return ChampionshipCompetitionService.pointsDiff;
                  // guessed match winner
                  default:
                     return ChampionshipCompetitionService.pointsWinner;
               }
            }
            break;
         // away team wins
         case resultHome < resultAway:
            if (predictHome < predictAway) {
               switch (true) {
                  // full guessed (3 points)
                  case resultHome === predictHome && resultAway === predictAway:
                     return ChampionshipCompetitionService.pointsFull;
                  // guessed goal difference
                  case resultHome - predictHome === resultAway - predictAway:
                     return ChampionshipCompetitionService.pointsDiff;
                  // guessed match winner
                  default:
                     return ChampionshipCompetitionService.pointsWinner;
               }
            }
            break;
         case resultHome === resultAway:
            if (predictHome === predictAway) {
               switch (true) {
                  // full guessed (3 points)
                  case resultHome === predictHome && resultAway === predictAway:
                     return ChampionshipCompetitionService.pointsFull;
                  // guessed goal difference
                  case resultHome - predictHome === resultAway - predictAway:
                     return ChampionshipCompetitionService.pointsDiff;
               }
            }
            break;
      }

      return ChampionshipCompetitionService.noPoints;
   }

   public static isChampionshipMatchGuessed(championshipMatch: ChampionshipMatch, championshipPrediction: ChampionshipPrediction): boolean {
      if (championshipMatch.match.state !== MatchState.Ended) {
         return false;
      }
      if (UtilsService.isScore(championshipPrediction.home, championshipPrediction.away)) {
         if (
            ChampionshipCompetitionService.getUserPointsOnMatch(
               championshipMatch.match.home,
               championshipMatch.match.away,
               championshipPrediction.home,
               championshipPrediction.away
            ) === ChampionshipCompetitionService.pointsFull
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
    * @returns {Partial<ChampionshipPrediction>[]}
    */
   public createChampionshipPredictionsArray(championshipPredictionsForm: FormGroup): Partial<ChampionshipPrediction>[] {
      const championshipPredictionsToUpdate: Partial<ChampionshipPrediction>[] = [];
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
         const currentMatch = championshipPredictionsToUpdate.find(myObj => myObj.championship_match_id === championshipMatchId);
         if (!currentMatch) {
            // If there is prediction only on home team
            if (
               championshipPredictionsForm.value[championshipMatchId + '_home'] !== null &&
               championshipPredictionsForm.value[championshipMatchId + '_away'] === null
            ) {
               championshipPredictionsToUpdate.push({
                  away: 0,
                  home: championshipPredictionsForm.value[championshipMatchId + '_home'],
                  championship_match_id: championshipMatchId
               });
               continue;
            }
            // If there is prediction only on away team
            if (
               championshipPredictionsForm.value[championshipMatchId + '_home'] === null &&
               championshipPredictionsForm.value[championshipMatchId + '_away'] !== null
            ) {
               championshipPredictionsToUpdate.push({
                  away: championshipPredictionsForm.value[championshipMatchId + '_away'],
                  home: 0,
                  championship_match_id: championshipMatchId
               });
               continue;
            }
            championshipPredictionsToUpdate.push({
               away: championshipPredictionsForm.value[championshipMatchId + '_away'],
               home: championshipPredictionsForm.value[championshipMatchId + '_home'],
               championship_match_id: championshipMatchId
            });
         }
      }

      return championshipPredictionsToUpdate;
   }

   public static isChampionshipSeasonWinner(award: Award): boolean {
      return award.id === 4;
   }
}
