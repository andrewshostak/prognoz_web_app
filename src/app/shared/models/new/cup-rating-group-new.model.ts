/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';

export class CupRatingGroupNew {
   user_id: number;
   points: number;
   win: number;
   draw: number;
   loss: number;
   scored: number;
   missed: number;
   points_sum: number;
   dc_sum: number;

   user: UserNew;
}
