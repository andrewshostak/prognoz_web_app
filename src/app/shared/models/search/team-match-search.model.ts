import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class TeamMatchSearch {
   public active?: ModelStatus;
   // todo: this param is changed to teamStageId. remove after transition
   public competitionId?: number;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public teamStageId?: number;
}
