/* tslint:disable:variable-name */
import { UserNew } from '@models/v2/user-new.model';
import { AwardNew } from '@models/v2/award-new.model';

export class WinNew {
   award_id: number;
   competition_id: number;
   created_at: string;
   updated_at: string;
   user_id: number;

   user?: UserNew;
   award?: AwardNew;
}
