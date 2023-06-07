import { UserNew } from '@models/v2/user-new.model';

export class ChampionshipSeasonRatingItem {
   user: UserNew;
   competitions: [{ [id: string]: number }];
   points: number;
}
