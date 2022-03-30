/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';
import { TeamNew } from '@models/new/team-new.model';

export class TeamRatingUserNew {
   public id: number;
   public competition_id: number;
   public team_id: number;
   public user_id: number;
   public scored: number;
   public blocked: number;

   public team?: TeamNew;
   public user?: UserNew;
}
