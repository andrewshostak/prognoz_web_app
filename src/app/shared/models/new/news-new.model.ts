/* tslint:disable:variable-name */
import { Tournament } from '@models/tournament.model';
import { CommentNew } from '@models/new/comment-new.model';
import { UserNew } from '@models/new/user-new.model';

export class NewsNew {
   id: number;
   title: string;
   body: string;
   image: string;
   tournament_id: number;
   author_id: number;
   created_at: string;
   updated_at: string;

   tournament?: Tournament;
   comments?: CommentNew[];
   author?: UserNew;
}
