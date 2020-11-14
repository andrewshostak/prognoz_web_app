import { Sequence } from '@enums/sequence.enum';

export class GuestbookMessageSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public userId?: number;
   public relations?: string[];
   public sequence?: Sequence;
}
