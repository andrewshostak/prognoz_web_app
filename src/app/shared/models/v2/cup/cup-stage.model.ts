/* tslint:disable:variable-name */
import { Competition } from '@models/v2/competition.model';
import { CupStageType } from '@models/v2/cup/cup-stage-type.model';
import { CupStageState } from '@enums/cup-stage-state.enum';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupMatch } from '@models/v2/cup/cup-match.model';

export class CupStage {
   competition_id: number;
   relegation_to_competition_id: null | number;
   cup_stage_type_id: number;
   created_at: string;
   id: number;
   round: number;
   state: CupStageState;
   title: string;
   updated_at: string;

   competition: Competition;
   cup_stage_type?: CupStageType;
   cup_cup_matches?: CupCupMatch[];
   cup_matches?: CupMatch[];
}
