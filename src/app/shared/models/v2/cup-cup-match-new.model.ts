/* tslint:disable:variable-name */
import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { CupStageNew } from '@models/v2/cup-stage-new.model';
import { UserNew } from '@models/v2/user-new.model';

export class CupCupMatchNew {
   away: number;
   away_dc_sum: number;
   away_points: number;
   away_rating_points: number;
   away_user_id: number;
   created_at: string;
   cup_stage_id: number;
   group_number: number;
   home: number;
   home_dc_sum: number;
   home_points: number;
   home_rating_points: number;
   home_user_id: number;
   id: number;
   state: CupCupMatchState;
   updated_at: string;

   home_user?: UserNew;
   away_user?: UserNew;
   cup_stage: CupStageNew;
   cup_predictions_away_count?: number;
   cup_predictions_home_count?: number;
}
