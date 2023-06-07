/* tslint:disable:variable-name */
import { CupRatingNew } from '@models/v2/cup-rating-new.model';
import { UserNew } from '@models/v2/user-new.model';

export class CupRatingCalculatedNew {
   user_id: number;
   win: number;
   draw: number;
   loss: number;
   scored: number;
   missed: number;
   points_calculated: number;
   rating_items: CupRatingNew[];
   user: UserNew;
}
