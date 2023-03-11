import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class CupMatchSearch {
   cupCupMatchId?: number; // todo: move to cupCupMatchIds
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
   showPredictability?: boolean;
   states?: MatchState[];
   userId?: number;
}
