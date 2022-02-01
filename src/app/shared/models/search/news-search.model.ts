import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';

export class NewsSearch {
   public authorId?: string;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public relations?: string[];
   public tournamentId?: Tournament;
}
