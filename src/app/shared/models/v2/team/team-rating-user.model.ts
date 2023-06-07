/* tslint:disable:variable-name */
import { User } from '@models/v2/user.model';
import { Team } from '@models/v2/team/team.model';

export class TeamRatingUser {
   id: number;
   competition_id: number;
   team_id: number;
   user_id: number;
   scored: number;
   blocked: number;
   scores_blocked: number;

   team?: Team;
   user?: User;
}
