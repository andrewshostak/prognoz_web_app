import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class TeamParticipantSearch {
   captain?: number;
   competitionId?: number;
   confirmed?: ModelStatus;
   ended?: ModelStatus;
   limit: number;
   orderBy?: string;
   page: number;
   refused?: ModelStatus;
   sequence?: Sequence;
   teamId?: number;
   teamStageId?: number;
   userId?: number;
}
