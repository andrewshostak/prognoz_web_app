/* tslint:disable:variable-name */
import { CupMatchNew } from '@models/v2/cup-match-new.model';

export class CupPredictionNew {
   id: number;
   user_id: number;
   cup_match_id: number;
   cup_cup_match_id: number;
   home: number;
   away: number;
   created_at: string;
   updated_at: string;

   cup_match?: CupMatchNew;
}
