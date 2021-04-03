import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';

export class TeamStageSearch {
   public state?: TeamStageState;
   public competitionId?: number;
   public relations?: string[];
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
}
