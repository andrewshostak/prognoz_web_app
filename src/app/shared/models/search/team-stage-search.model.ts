import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';

export class TeamStageSearch {
   public competitionId?: number;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public state?: TeamStageState;
   public states?: TeamStageState[];
}
