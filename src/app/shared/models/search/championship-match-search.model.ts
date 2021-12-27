import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class ChampionshipMatchSearch {
   public competitionId?: number;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public soon?: ModelStatus;
   public states?: MatchState[];
   public userId?: number;
}
