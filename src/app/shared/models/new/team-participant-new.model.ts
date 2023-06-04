import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamNew } from '@models/new/team-new.model';
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
