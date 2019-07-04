import { ModelStatus } from '@enums/model-status.enum';

/* tslint:disable:variable-name */
export class CompetitionNew {
   public active: ModelStatus;
   public active_round: number;
   public ended: ModelStatus;
   public first_playoff_stage: number;
   public id: number;
   public number_in_season: number;
   public number_of_teams: number;
   public participants: number;
   public players_in_group: number;
   public title: string;
   public season_id: number;
   public stated: ModelStatus;

   public pivot?: {
      competition_id: number;
      number_in_competition: number;
      number_in_round: number;
      round: number;
   };
}
