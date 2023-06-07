import { CompetitionState } from '@enums/competition-state.enum';
import { Win } from '@models/v2/win.model';
import { CupApplication } from '@models/v2/cup/cup-application.model';
import { Season } from '@models/v2/season.model';
import { Tournament } from '@models/v2/tournament.model';

/* tslint:disable:variable-name */
export class Competition {
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

   winners?: Win[];
   cup_applications?: CupApplication[];
   season?: Season;
   tournament?: Tournament;
}
