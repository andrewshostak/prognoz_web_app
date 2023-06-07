/* tslint:disable:variable-name */
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { Match } from '@models/v2/match.model';

export class ChampionshipMatch {
   competition_id: number;
   created_at: string;
   dc: number;
   id: number;
   match_id: number;
   number_in_competition: number;
   points: number;
   predicts: number;
   updated_at: string;

   match?: Match;
   championship_predicts?: ChampionshipPrediction[];
}
