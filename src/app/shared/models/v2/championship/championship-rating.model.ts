/* tslint:disable:variable-name */
import { User } from '@models/v2/user.model';
import { Competition } from '@models/v2/competition.model';

export class ChampionshipRating {
   id: number;
   competition_id: number;
   user_id: number;
   points: number;
   x3: number;
   x2: number;
   dc: number;
   position: number;
   moving: number;

   user?: User;
   competition?: Competition;
}
