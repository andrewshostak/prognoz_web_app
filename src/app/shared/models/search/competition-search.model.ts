import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';

export class CompetitionSearch {
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   seasonId?: number;
   sequence?: Sequence;
   states?: CompetitionState[];
   tournamentId?: Tournament;
}
