/* tslint:disable:variable-name */
import { CupMatch } from '@models/v2/cup/cup-match.model';

export class CupPrediction {
   id: number;
   user_id: number;
   cup_match_id: number;
   cup_cup_match_id: number;
   home: number;
   away: number;
   created_at: string;
   updated_at: string;

   cup_match?: CupMatch;
}
