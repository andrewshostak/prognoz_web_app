import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class TeamMatchSearch {
   public active?: ModelStatus;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public relations?: string[];
   public sequence?: Sequence;
   public teamStageId?: number;
}
