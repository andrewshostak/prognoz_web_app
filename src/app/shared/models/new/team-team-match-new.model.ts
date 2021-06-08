/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';

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
   created_at: string;
   updated_at: string;
}
