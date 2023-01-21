import { Sequence } from '@enums/sequence.enum';

export class CupApplicationSearch {
   competitionId?: number;
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
}
