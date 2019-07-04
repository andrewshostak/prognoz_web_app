/* tslint:disable:variable-name */
import { CupStage } from '@models/cup/cup-stage.model';
import { Match } from '@models/match.model';

export class CupMatchNew {
   public created_at: string;
   public dc_sum: number;
   public guessed: number;
   public id: number;
   public match_id: number;
   public points: number;
   public predictions: number;
   public updated_at: string;

   public match?: Match;
   public cup_stages: CupStage[];
}
