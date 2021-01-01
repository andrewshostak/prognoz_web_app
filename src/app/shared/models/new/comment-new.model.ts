/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';

export class CommentNew {
   public id: number;
   public user_id: number;
   public news_id: number;
   public body: string;
   public created_at: string;
   public updated_at: string;
   public updated_by: number;
   public deleted_at: string;
   public deleted_by: number;

   public user?: UserNew;
   public updater?: Partial<UserNew>;
   public deleter?: Partial<UserNew>;
}
