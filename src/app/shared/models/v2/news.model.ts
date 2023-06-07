/* tslint:disable:variable-name */
import { Tournament } from '@models/v2/tournament.model';
import { Comment } from '@models/v2/comment.model';
import { User } from '@models/v2/user.model';

export class News {
   id: number;
   title: string;
   body: string;
   image: string;
   tournament_id: number;
   author_id: number;
   created_at: string;
   updated_at: string;

   tournament?: Tournament;
   comments?: Comment[];
   author?: User;
}
