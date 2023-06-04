import { Sequence } from '@enums/sequence.enum';
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';

export class TeamTeamMatchSearch {
   limit: number;
   orderBy?: string;
   teamStageId?: number;
   page: number;
   relations?: string[];
   sequence?: Sequence;
   states?: TeamTeamMatchState[];
}
