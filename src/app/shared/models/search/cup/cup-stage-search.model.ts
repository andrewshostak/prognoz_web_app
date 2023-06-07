import { CupStageState } from '@enums/cup-stage-state.enum';
import { Sequence } from '@enums/sequence.enum';

export class CupStageSearch {
   competitionId?: number;
   relations?: string[];
   limit: number;
   orderBy?: string;
   page: number;
   round?: number;
   sequence?: Sequence;
   states?: CupStageState[];
}
