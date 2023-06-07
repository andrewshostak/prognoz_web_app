import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class ChampionshipMatchSearch {
   competitionId?: number;
   limit: number;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
   soon?: ModelStatus;
   states?: MatchState[];
   userId?: number;
}
