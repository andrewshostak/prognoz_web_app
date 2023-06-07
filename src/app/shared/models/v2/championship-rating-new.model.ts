/* tslint:disable:variable-name */
import { UserNew } from '@models/v2/user-new.model';
import { CompetitionNew } from '@models/v2/competition-new.model';

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
