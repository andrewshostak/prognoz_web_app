import { Sequence } from '@enums/sequence.enum';

export class ChampionshipPredictionSearch {
   public championshipMatchId: number;
   public userId: number;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
}
