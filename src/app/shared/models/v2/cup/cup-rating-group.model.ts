/* tslint:disable:variable-name */
import { User } from '@models/v2/user.model';

export class CupRatingGroup {
   user_id: number;
   points: number;
   win: number;
   draw: number;
   loss: number;
   scored: number;
   missed: number;
   points_sum: number;
   dc_sum: number;

   user: User;
}
