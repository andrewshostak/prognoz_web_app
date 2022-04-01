import { Sequence } from '@enums/sequence.enum';

export class ChampionshipRatingSearch {
   public competitionId?: number;
   public limit: number;
   public orderBy?: string;
   public sequence?: Sequence;
   public page: number;
   public relations?: string[];
   public userId?: number;
}
