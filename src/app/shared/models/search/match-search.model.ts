import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class MatchSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public states?: MatchState[];
}
