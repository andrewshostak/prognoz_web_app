/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';

export class GuestbookMessageNew {
   public id: number;
   public user_id: number;
   public body: string;
   public created_at: string;
   public updated_at: string;

   public user?: UserNew;
}
