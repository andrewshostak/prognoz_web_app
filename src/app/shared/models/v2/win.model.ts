/* tslint:disable:variable-name */
import { User } from '@models/v2/user.model';
import { Award } from '@models/v2/award.model';

export class Win {
   award_id: number;
   competition_id: number;
   created_at: string;
   updated_at: string;
   user_id: number;

   user?: User;
   award?: Award;
}
