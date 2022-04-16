/* tslint:disable:variable-name */
import { ChampionshipPredictionNew } from '@models/new/championship-prediction-new.model';
import { Match } from '@models/match.model';

export class ChampionshipMatchNew {
   public competition_id: number;
   public created_at: string;
   public dc: number;
   public id: number;
   public match_id: number;
   public number_in_competition: number;
   public points: number;
   public predicts: number;
   public updated_at: string;

   public match?: Match;
   public championship_predicts?: ChampionshipPredictionNew[];
}
