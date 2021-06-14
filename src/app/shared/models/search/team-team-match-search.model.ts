import { Sequence } from '@enums/sequence.enum';

export class TeamTeamMatchSearch {
   public limit: number;
   public orderBy?: string;
   public teamStageId?: number;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
}
