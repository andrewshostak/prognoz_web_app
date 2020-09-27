/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';

export class CupStageNew {
   public active: ModelStatus;
   public competition_id: number;
   public cup_stage_type_id: number;
   public ended: ModelStatus;
   public round: number;
   public title: string;
}
