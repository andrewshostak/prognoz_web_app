/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';

export class ChampionshipRatingNew {
   public id: number;
   public competition_id: number;
   public user_id: number;
   public points: number;
   public x3: number;
   public x2: number;
   public dc: number;
   public position: number;
   public moving: number;

   public user?: UserNew;
   public competition?: CompetitionNew;
}
