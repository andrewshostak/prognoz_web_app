/* tslint:disable:variable-name */
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';
import { Team } from '@models/v2/team/team.model';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { User } from '@models/v2/user.model';

export class TeamTeamMatch {
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

   home_team?: Team;
   away_team?: Team;
   team_stage?: TeamStage;
   away_team_goalkeeper?: User;
   home_team_goalkeeper?: User;
}
