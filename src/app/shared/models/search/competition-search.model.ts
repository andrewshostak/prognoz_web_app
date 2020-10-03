import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';

export class CompetitionSearch {
   public active?: ModelStatus;
   public ended?: ModelStatus;
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public stated?: ModelStatus;
   public tournamentId?: Tournament;
}
