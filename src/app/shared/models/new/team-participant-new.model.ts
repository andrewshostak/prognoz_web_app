import { TeamNew } from '@models/new/team-new.model';
import { User } from '@models/user.model';

/* tslint:disable:variable-name */
export class TeamParticipantNew {
   public id: number;
   public team_id: number;
   public user_id: number;
   public competition_id: number;
   public captain: boolean;
   public confirmed: boolean;
   public refused: boolean;
   public ended: boolean;
   public created_at: string;
   public updated_at: string;
   public team: TeamNew;
   public user: User;
}
