/* tslint:disable:variable-name */
import { User } from '@models/v2/user.model';

export class Comment {
   id: number;
   user_id: number;
   news_id: number;
   body: string;
   created_at: string;
   updated_at: string;
   updated_by: number;
   deleted_at: string;
   deleted_by: number;

   is_changeable?: boolean;

   user?: User;
   updater?: Partial<User>;
   deleter?: Partial<User>;
}
