/* tslint:disable:variable-name */
import { CupStageNew } from '@models/new/cup-stage-new.model';
import { Match } from '@models/match.model';

export class CupMatchNew {
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
   cup_stages: CupStageNew[];
}
