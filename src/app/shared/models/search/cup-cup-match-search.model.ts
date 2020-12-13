import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class CupCupMatchSearch {
   public active?: ModelStatus;
   public cupStageId: number;
   public cupPredictionsCount?: boolean;
   public ended?: ModelStatus;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
}