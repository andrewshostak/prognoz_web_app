import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

/* tslint:disable:variable-name */
export class TeamSearch {
   public captainId?: number;
   public competitionId?: number;
   public confirmed?: ModelStatus;
   public limit: number;
   public name?: string;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public stated?: ModelStatus;
   public teamParticipantId?: number;
}
