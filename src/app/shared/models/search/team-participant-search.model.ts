import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';

export class TeamParticipantSearch {
   public captain: number;
   public competitionId: number;
   public confirmed: ModelStatus;
   public ended: ModelStatus;
   public limit: number;
   public orderBy: string;
   public page: number;
   public refused: ModelStatus;
   public sequence: Sequence;
   public teamId: number;
   public userId: number;
}
