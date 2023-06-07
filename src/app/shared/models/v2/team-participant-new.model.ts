import { CompetitionNew } from '@models/v2/competition-new.model';
import { TeamNew } from '@models/v2/team-new.model';
import { User } from '@models/user.model';

/* tslint:disable:variable-name */
export class TeamParticipantNew {
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

   team?: TeamNew;
   user?: User;
   competition?: CompetitionNew;
}
