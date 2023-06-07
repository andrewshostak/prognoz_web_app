/* tslint:disable:variable-name */
import { TeamMatch } from '@models/v2/team/team-match.model';
import { User } from '@models/v2/user.model';

export class TeamPrediction {
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

   team_match?: TeamMatch;
   user?: User;
}
