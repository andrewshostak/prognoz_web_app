/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';
import { CupStageNew } from '@models/new/cup-stage-new';
import { UserNew } from '@models/new/user-new.model';

export class CupCupMatchNew {
   public active: ModelStatus;
   public away: number;
   public away_dc_sum: number;
   public away_points: number;
   public away_rating_points: number;
   public away_user_id: number;
   public created_at: string;
   public cup_stage_id: number;
   public ended: ModelStatus;
   public group_number: number;
   public home: number;
   public home_dc_sum: number;
   public home_points: number;
   public home_rating_points: number;
   public home_user_id: number;
   public id: number;
   public updated_at: string;

   public home_user?: UserNew;
   public away_user?: UserNew;
   public cup_stage: CupStageNew;
   public cup_predictions_away_count?: number;
   public cup_predictions_home_count?: number;
}
