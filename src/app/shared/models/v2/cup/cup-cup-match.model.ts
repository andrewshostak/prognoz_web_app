/* tslint:disable:variable-name */
import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { User } from '@models/v2/user.model';

export class CupCupMatch {
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

   home_user?: User;
   away_user?: User;
   cup_stage: CupStage;
   cup_predictions_away_count?: number;
   cup_predictions_home_count?: number;
}
