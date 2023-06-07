/* tslint:disable:variable-name */
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';
import { TeamNew } from '@models/v2/team-new.model';
import { TeamStageNew } from '@models/v2/team-stage-new.model';
import { UserNew } from '@models/v2/user-new.model';

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
   state: TeamTeamMatchState;
   created_at: string;
   updated_at: string;
   group_number: number;

   home_team?: TeamNew;
   away_team?: TeamNew;
   team_stage?: TeamStageNew;
   away_team_goalkeeper?: UserNew;
   home_team_goalkeeper?: UserNew;
}
