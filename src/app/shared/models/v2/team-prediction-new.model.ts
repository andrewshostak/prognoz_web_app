/* tslint:disable:variable-name */
import { TeamMatchNew } from '@models/v2/team-match-new.model';
import { UserNew } from '@models/v2/user-new.model';

export class TeamPredictionNew {
   id: number;
   team_id: number;
   team_match_id: number;
   user_id: number;
   home: number;
   away: number;
   predicted_at: string;
   blocked_by: number;
   blocked_at: string;
   created_at: string;
   updated_at: string;

   team_match?: TeamMatchNew;
   user?: UserNew;
}
