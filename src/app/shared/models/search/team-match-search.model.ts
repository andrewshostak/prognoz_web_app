import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class TeamMatchSearch {
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
   states?: MatchState[];
   teamStageId?: number;
   showPredictionsViewability?: boolean;
}
