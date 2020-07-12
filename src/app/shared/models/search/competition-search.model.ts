import { ModelStatus } from '@enums/model-status.enum';
import { Tournament } from '@enums/tournament.enum';

export class CompetitionSearch {
   public active?: ModelStatus;
   public ended?: ModelStatus;
   public limit: number;
   public page: number;
   public stated?: ModelStatus;
   public tournamentId?: Tournament;
}
