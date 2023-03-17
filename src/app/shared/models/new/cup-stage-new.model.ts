/* tslint:disable:variable-name */
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupStageTypeNew } from '@models/new/cup-stage-type-new.model';
import { CupStageState } from '@enums/cup-stage-state.enum';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { CupMatchNew } from '@models/new/cup-match-new.model';

export class CupStageNew {
   public competition_id: number;
   public cup_stage_type_id: number;
   public created_at: string;
   public id: number;
   public round: number;
   public state: CupStageState;
   public title: string;
   public updated_at: string;

   public competition: CompetitionNew;
   public cup_stage_type?: CupStageTypeNew;
   cup_cup_matches?: CupCupMatchNew[];
   cup_matches?: CupMatchNew[];
}
