import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { Sequence } from '@enums/sequence.enum';

export class CupCupMatchSearch {
   public competitionId?: number;
   public cupStageId?: number;
   public cupPredictionsCount?: boolean;
   public groupNumber?: number;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public states?: CupCupMatchState[];
}
