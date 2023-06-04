import { Sequence } from '@enums/sequence.enum';

export class TeamRatingUserSearch {
   competitionId?: number;
   limit: number;
   orderBy?: string;
   sequence?: Sequence;
   page: number;
   relations?: string[];
   userId?: number;
}
