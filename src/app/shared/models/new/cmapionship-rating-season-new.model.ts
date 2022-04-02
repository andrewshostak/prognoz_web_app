import { UserNew } from '@models/new/user-new.model';

export class ChampionshipSeasonRatingItem {
   public user: UserNew;
   public competitions: [{ [id: string]: number }];
   public points: number;
}
