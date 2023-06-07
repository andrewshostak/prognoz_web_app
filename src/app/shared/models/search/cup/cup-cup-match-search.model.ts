import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { Sequence } from '@enums/sequence.enum';

export class CupCupMatchSearch {
   competitionId?: number;
   cupStageId?: number;
   cupPredictionsCount?: boolean;
   groupNumber?: number;
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
   states?: CupCupMatchState[];
   userId?: number;
}
