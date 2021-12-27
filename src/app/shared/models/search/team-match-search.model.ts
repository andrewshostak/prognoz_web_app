import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';

export class TeamMatchSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public states?: MatchState[];
   public teamStageId?: number;
}
