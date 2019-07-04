import { Sequence } from '@enums/sequence.enum';

export class ChampionshipMatchSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
}
