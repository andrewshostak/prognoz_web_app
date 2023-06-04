import { Sequence } from '@enums/sequence.enum';
import { ModelStatus } from '@enums/model-status.enum';

export class CommentSearch {
   limit: number;
   orderBy?: string;
   page: number;
   newsId?: number;
   relations?: string[];
   sequence?: Sequence;
   trashed?: ModelStatus;
}
