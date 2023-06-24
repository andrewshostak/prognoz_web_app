/* tslint:disable:variable-name */
import { TeamMatch } from '@models/v1/team-match.model';

export class TeamPrediction {
   id?: number;
   team_id: number;
   team_match_id: number;
   user_id?: number;
   home?: number;
   away?: number;
   predicted_at?: string;
   blocked_by?: number;
   blocked_at?: string;

   team_match?: TeamMatch;
   user?: {
      name: string;
   };
}
