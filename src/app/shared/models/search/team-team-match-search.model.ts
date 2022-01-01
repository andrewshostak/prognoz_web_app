import { Sequence } from '@enums/sequence.enum';
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';

export class TeamTeamMatchSearch {
   public limit: number;
   public orderBy?: string;
   public teamStageId?: number;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public states?: TeamTeamMatchState[];
}
