import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';

export class CompetitionSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public seasonId?: number;
   public sequence?: Sequence;
   public states?: CompetitionState[];
   public tournamentId?: Tournament;
}
