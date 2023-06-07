import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';

export class TeamStageSearch {
   competitionId?: number;
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
   state?: TeamStageState;
   states?: TeamStageState[];
   rounds?: number[];
}
