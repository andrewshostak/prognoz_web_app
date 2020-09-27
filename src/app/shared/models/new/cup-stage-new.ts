/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';

export class CupStageNew {
   public active: ModelStatus;
   public competition_id: number;
   public cup_stage_type_id: number;
   public created_at: string;
   public ended: ModelStatus;
   public id: number;
   public round: number;
   public title: string;
   public updated_at: string;
}
