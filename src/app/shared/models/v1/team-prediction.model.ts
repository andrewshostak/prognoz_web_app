/* tslint:disable:variable-name */
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
   team_match?: any;
}
