import { Sequence } from '@enums/sequence.enum';

export class ChampionshipPredictionSearch {
   championshipMatchId?: number;
   competitionId?: number;
   userId?: number;
   limit: number;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
}
