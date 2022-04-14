/* tslint:disable:variable-name */
import { TournamentNew } from '@models/new/tournament-new.model';
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

   tournament?: TournamentNew;
   comments?: CommentNew[];
   author?: UserNew;
}
