import { Sequence } from '@enums/sequence.enum';

export class TeamRatingSearch {
   competitionId?: number;
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
}
