/* tslint:disable:variable-name */
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';

export class ChampionshipMatchStatistic {
   championship_match: ChampionshipMatchNew;
   results: {
      away: number;
      draw: number;
      home: number;
   };
   scores: { [key: string]: number }[];
}
