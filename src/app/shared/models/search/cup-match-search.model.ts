import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class CupMatchSearch {
   public active?: ModelStatus;
   public cupCupMatchId?: number;
   public ended?: ModelStatus;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public states?: MatchState[];
}
