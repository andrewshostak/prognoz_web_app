import { Sequence } from '@enums/sequence.enum';
import { ModelStatus } from '@enums/model-status.enum';

export class GuestbookMessageSearch {
   limit: number;
   orderBy?: string;
   page: number;
   userId?: number;
   relations?: string[];
   sequence?: Sequence;
   trashed?: ModelStatus;
}
