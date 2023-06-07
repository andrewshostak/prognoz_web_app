import { Competition } from '@models/v2/competition.model';
import { Team } from '@models/v2/team/team.model';
import { User } from '@models/v2/user.model';

/* tslint:disable:variable-name */
export class TeamParticipant {
   id: number;
   team_id: number;
   user_id: number;
   competition_id: number;
   captain: boolean;
   confirmed: boolean;
   refused: boolean;
   ended: boolean;
   created_at: string;
   updated_at: string;

   team?: Team;
   user?: User;
   competition?: Competition;
}
