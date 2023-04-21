import { CupStageState } from '@enums/cup-stage-state.enum';
import { Sequence } from '@enums/sequence.enum';

export class CupStageSearch {
   public competitionId?: number;
   public relations?: string[];
   public limit: number;
   public orderBy?: string;
   public page: number;
   round?: number;
   public sequence?: Sequence;
   public states?: CupStageState[];
}
