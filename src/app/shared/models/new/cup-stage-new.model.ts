/* tslint:disable:variable-name */
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupStageTypeNew } from '@models/new/cup-stage-type-new.model';
import { CupStageState } from '@enums/cup-stage-state.enum';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { CupMatchNew } from '@models/new/cup-match-new.model';

export class CupStageNew {
   competition_id: number;
   cup_stage_type_id: number;
   created_at: string;
   id: number;
   round: number;
   state: CupStageState;
   title: string;
   updated_at: string;

   competition: CompetitionNew;
   cup_stage_type?: CupStageTypeNew;
   cup_cup_matches?: CupCupMatchNew[];
   cup_matches?: CupMatchNew[];
}
