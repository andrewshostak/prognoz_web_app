import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';

export class NewsSearch {
   authorId?: string;
   limit: number;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
   relations?: string[];
   tournamentId?: Tournament;
}
