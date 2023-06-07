/* tslint:disable:variable-name */
import { TeamStageState } from '@enums/team-stage-state.enum';
import { CompetitionNew } from '@models/v2/competition-new.model';
import { TeamStageTypeNew } from '@models/v2/team-stage-type-new.model';

export class TeamStageNew {
   id: number;
   team_stage_type_id: number;
   competition_id: number;
   title: string;
   round: string;
   state: TeamStageState;
   created_at: string;
   updated_at: string;

   competition?: CompetitionNew;
   team_stage_type?: TeamStageTypeNew;
}
