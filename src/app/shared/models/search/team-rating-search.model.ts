import { Sequence } from '@enums/sequence.enum';

export class TeamRatingSearch {
   public competitionId?: number;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
}
