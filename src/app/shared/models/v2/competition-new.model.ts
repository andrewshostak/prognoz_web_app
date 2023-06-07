import { CompetitionState } from '@enums/competition-state.enum';
import { WinNew } from '@models/v2/win-new.model';
import { CupApplicationNew } from '@models/v2/cup-application-new.model';
import { SeasonNew } from '@models/v2/season-new.model';
import { TournamentNew } from '@models/v2/tournament-new.model';

/* tslint:disable:variable-name */
export class CompetitionNew {
   config: {
      team?: {
         relegation?: number;
         promotion?: number;
      };
      cup?: {
         is_friendly: boolean;
      };
   };
   id: number;
   number_in_season: number;
   title: string;
   season_id: number;
   state: CompetitionState;
   tournament_id: number;
   updated_at: string;

   pivot?: {
      competition_id: number;
      number_in_competition: number;
      number_in_round: number;
      round: number;
   };

   winners?: WinNew[];
   cup_applications?: CupApplicationNew[];
   season?: SeasonNew;
   tournament?: TournamentNew;
}
