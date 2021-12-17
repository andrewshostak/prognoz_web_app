import { ModelStatus } from '@enums/model-status.enum';
import { CompetitionState } from '@enums/competition-state.enum';

/* tslint:disable:variable-name */
export class CompetitionNew {
   public active: ModelStatus;
   public active_round: number;
   public config: {
      team?: {
         relegation?: number;
         promotion?: number;
      };
   };
   public ended: ModelStatus;
   public first_playoff_stage: number;
   public id: number;
   public number_in_season: number;
   public number_of_teams: number;
   public participants: number;
   public players_in_group: number;
   public title: string;
   public season_id: number;
   public state: CompetitionState;
   public stated: ModelStatus;
   public updated_at: string;

   public pivot?: {
      competition_id: number;
      number_in_competition: number;
      number_in_round: number;
      round: number;
   };
}
