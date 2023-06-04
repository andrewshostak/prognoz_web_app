import { Sequence } from '@enums/sequence.enum';

export class ClubSearch {
   limit: number;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
   parentId?: number;
   search?: string;
   relations?: string[];
   type?: 'national_teams' | 'clubs';
}
