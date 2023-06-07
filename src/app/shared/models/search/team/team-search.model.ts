import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

/* tslint:disable:variable-name */
export class TeamSearch {
   captainId?: number;
   competitionId?: number;
   confirmed?: ModelStatus;
   limit: number;
   name?: string;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
   stated?: ModelStatus;
   teamParticipantId?: number;
   teamStageId?: number;
}
