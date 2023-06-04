/* tslint:disable:variable-name */
import { ChampionshipPredictionNew } from '@models/new/championship-prediction-new.model';
import { Match } from '@models/match.model';

export class ChampionshipMatchNew {
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
   championship_predicts?: ChampionshipPredictionNew[];
}
