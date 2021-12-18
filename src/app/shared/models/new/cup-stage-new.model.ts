/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupStageTypeNew } from '@models/new/cup-stage-type-new.model';
import { CupStageState } from '@enums/cup-stage-state.enum';

export class CupStageNew {
   public active: ModelStatus;
   public competition_id: number;
   public cup_stage_type_id: number;
   public created_at: string;
   public ended: ModelStatus;
   public id: number;
   public round: number;
   public state: CupStageState;
   public title: string;
   public updated_at: string;

   public competition: CompetitionNew;
   public cup_stage_type?: CupStageTypeNew;
}
