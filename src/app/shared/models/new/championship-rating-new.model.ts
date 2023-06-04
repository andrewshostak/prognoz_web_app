/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';

export class ChampionshipRatingNew {
   id: number;
   competition_id: number;
   user_id: number;
   points: number;
   x3: number;
   x2: number;
   dc: number;
   position: number;
   moving: number;

   user?: UserNew;
   competition?: CompetitionNew;
}
