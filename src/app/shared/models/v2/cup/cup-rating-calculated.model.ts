/* tslint:disable:variable-name */
import { CupRating } from '@models/v2/cup/cup-rating.model';
import { User } from '@models/v2/user.model';

export class CupRatingCalculated {
   user_id: number;
   win: number;
   draw: number;
   loss: number;
   scored: number;
   missed: number;
   points_calculated: number;
   rating_items: CupRating[];
   user: User;
}
