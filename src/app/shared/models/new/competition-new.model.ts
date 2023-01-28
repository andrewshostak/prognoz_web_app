import { CompetitionState } from '@enums/competition-state.enum';
import { WinNew } from '@models/new/win-new.model';
import { CupApplicationNew } from '@models/new/cup-application-new.model';
import { SeasonNew } from '@models/new/season-new.model';
import { TournamentNew } from '@models/new/tournament-new.model';

/* tslint:disable:variable-name */
export class CompetitionNew {
   public config: {
      team?: {
         relegation?: number;
         promotion?: number;
      };
      cup?: {
         is_friendly: boolean;
      };
   };
   public first_playoff_stage: number;
   public id: number;
   public number_in_season: number;
   public number_of_teams: number;
   public participants: number;
   public players_in_group: number;
   public title: string;
   public season_id: number;
   public state: CompetitionState;
   public tournament_id: number;
   public updated_at: string;

   public pivot?: {
      competition_id: number;
      number_in_competition: number;
      number_in_round: number;
      round: number;
   };

   public winners?: WinNew[];
   public cup_applications?: CupApplicationNew[];
   public season?: SeasonNew;
   public tournament?: TournamentNew;
}
