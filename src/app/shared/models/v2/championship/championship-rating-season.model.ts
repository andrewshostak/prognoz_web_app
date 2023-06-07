import { User } from '@models/v2/user.model';

export class ChampionshipSeasonRatingItem {
   user: User;
   competitions: [{ [id: string]: number }];
   points: number;
}
