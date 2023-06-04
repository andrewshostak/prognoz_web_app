import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class MatchSearch {
   limit: number;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
   states?: MatchState[];
}
