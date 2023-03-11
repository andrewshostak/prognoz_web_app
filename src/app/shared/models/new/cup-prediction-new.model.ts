/* tslint:disable:variable-name */
import { CupMatchNew } from '@models/new/cup-match-new.model';

export class CupPredictionNew {
   public id: number;
   public user_id: number;
   public cup_match_id: number;
   public cup_cup_match_id: number;
   public home: number;
   public away: number;
   public created_at: string;
   public updated_at: string;

   cup_match?: CupMatchNew;
}
