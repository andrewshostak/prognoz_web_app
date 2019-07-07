import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class ChampionshipMatchSearch {
   public active?: ModelStatus;
   public ended?: ModelStatus;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public soon?: ModelStatus;
   public userId?: number;
}
