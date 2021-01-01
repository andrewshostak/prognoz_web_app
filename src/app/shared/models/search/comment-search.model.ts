import { Sequence } from '@enums/sequence.enum';
import { ModelStatus } from '@enums/model-status.enum';

export class CommentSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public newsId?: number;
   public relations?: string[];
   public sequence?: Sequence;
   public trashed?: ModelStatus;
}
