import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class CupMatchSearch {
   public cupCupMatchId?: number; // todo: move to cupCupMatchIds
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public states?: MatchState[];
}
