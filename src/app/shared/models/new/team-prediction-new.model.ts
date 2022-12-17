/* tslint:disable:variable-name */
import { TeamMatchNew } from '@models/new/team-match-new.model';
import { UserNew } from '@models/new/user-new.model';

export class TeamPredictionNew {
   public id: number;
   public team_id: number;
   public team_match_id: number;
   public user_id: number;
   public home: number;
   public away: number;
   public predicted_at: string;
   public blocked_by: number;
   public blocked_at: string;
   public created_at: string;
   public updated_at: string;

   public team_match?: TeamMatchNew;
   public user?: UserNew;
}
