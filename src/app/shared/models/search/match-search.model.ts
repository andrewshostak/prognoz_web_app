import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class MatchSearch {
   public active?: ModelStatus;
   public ended?: ModelStatus;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
}