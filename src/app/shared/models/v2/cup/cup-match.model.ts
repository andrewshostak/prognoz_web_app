/* tslint:disable:variable-name */
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { Match } from '@models/v2/match.model';

export class CupMatch {
   created_at: string;
   dc_sum: number;
   guessed: number;
   id: number;
   match_id: number;
   points: number;
   predictions: number;
   updated_at: string;

   match?: Match;
   is_predictable?: boolean;
   cup_stages: CupStage[];
}
