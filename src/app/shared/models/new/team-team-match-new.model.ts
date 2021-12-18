/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';
import { TeamNew } from '@models/new/team-new.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';

export class TeamTeamMatchNew {
   id: number;
   team_stage_id: number;
   home_team_id: number;
   away_team_id: number;
   home_team_goalkeeper_id: number;
   away_team_goalkeeper_id: number;
   home: number;
   away: number;
   home_points: number;
   away_points: number;
   home_dc_sum: number;
   away_dc_sum: number;
   active: ModelStatus;
   ended: ModelStatus;
   state: TeamTeamMatchState;
   created_at: string;
   updated_at: string;

   home_team?: TeamNew;
   away_team?: TeamNew;
   team_stage?: TeamStageNew;
}
