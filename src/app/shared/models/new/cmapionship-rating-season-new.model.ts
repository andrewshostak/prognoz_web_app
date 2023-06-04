import { UserNew } from '@models/new/user-new.model';

export class ChampionshipSeasonRatingItem {
   user: UserNew;
   competitions: [{ [id: string]: number }];
   points: number;
}
