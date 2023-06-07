/* tslint:disable:variable-name */
import { SeasonState } from '@enums/season-state.enum';

export class CupRating {
   id: number;
   season_id: number;
   user_id: number;
   points: number;
   scored: number;
   missed: number;
   win: number;
   draw: number;
   loss: number;
   season: {
      id: number;
      title: string;
      state: SeasonState;
      coefficient: number;
   };
}
