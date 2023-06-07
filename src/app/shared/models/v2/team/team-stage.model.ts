/* tslint:disable:variable-name */
import { TeamStageState } from '@enums/team-stage-state.enum';
import { Competition } from '@models/v2/competition.model';
import { TeamStageType } from '@models/v2/team/team-stage-type.model';

export class TeamStage {
   id: number;
   team_stage_type_id: number;
   competition_id: number;
   title: string;
   round: string;
   state: TeamStageState;
   created_at: string;
   updated_at: string;

   competition?: Competition;
   team_stage_type?: TeamStageType;
}
