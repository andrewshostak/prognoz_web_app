/* tslint:disable:variable-name */
import { UserNew } from '@models/v2/user-new.model';
import { TeamNew } from '@models/v2/team-new.model';

export class TeamRatingUserNew {
   id: number;
   competition_id: number;
   team_id: number;
   user_id: number;
   scored: number;
   blocked: number;
   scores_blocked: number;

   team?: TeamNew;
   user?: UserNew;
}
